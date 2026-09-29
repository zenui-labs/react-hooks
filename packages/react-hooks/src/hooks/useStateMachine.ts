import {useCallback, useEffect, useRef, useState} from 'react';
import {useLatest} from './useLatest';

// Blocks inference at a use site so state names are inferred only from the keys of `states`.
type StateMachineNoInfer<T> = [T][T extends unknown ? 0 : never];

export interface StateMachineGuardInfo<S extends string, E extends string> {
    from: S;
    event: E;
}

export interface StateMachineTransition<S extends string, E extends string> {
    target: S;
    /** Return false to block the transition. Reads the latest render's values. */
    guard?: (info: StateMachineGuardInfo<S, E>) => boolean;
}

export interface StateMachineEffectInfo<S extends string, E extends string> {
    /** The state being left (exit) or the one we came from (entry). `null` on the initial entry. */
    from: S | null;
    /** The state being entered. */
    to: S;
    /** The event that caused the transition. `null` for the initial entry and `reset()`. */
    event: E | null;
    /** Send another event, for example when async work started in `entry` finishes. */
    send: (event: E) => boolean;
}

export interface StateMachineStateConfig<S extends string, E extends string> {
    /** Event name to target state, or to `{target, guard}`. */
    on?: { [Ev in E]?: S | StateMachineTransition<S, E> };
    /** Runs after the state is entered. May return a cleanup that runs when the state is left or on unmount. */
    entry?: (info: StateMachineEffectInfo<S, E>) => void | (() => void);
    /** Runs when the state is left through a transition or `reset()`. Not called on unmount. */
    exit?: (info: StateMachineEffectInfo<S, E>) => void;
}

export interface StateMachineConfig<S extends string, E extends string> {
    initial: StateMachineNoInfer<S>;
    states: { [K in S]: StateMachineStateConfig<StateMachineNoInfer<S>, E> };
}

export interface StateMachineOptions {
    /** How many transitions to keep in `history`. Defaults to 20. Use 0 to keep none. */
    historyLimit?: number;
}

export interface StateMachineHistoryEntry<S extends string, E extends string> {
    from: S;
    to: S;
    event: E;
    /** `Date.now()` when the transition happened. */
    at: number;
}

export interface StateMachine<S extends string, E extends string> {
    state: S;
    /** The event behind the latest transition. `null` initially and after `reset()`. */
    event: E | null;
    /** Try a transition. Returns true when the machine moved. */
    send: (event: E) => boolean;
    /** True when `event` would cause a transition from the current state, guards included. */
    can: (event: E) => boolean;
    /** True when the current state is one of `states`. */
    matches: (...states: S[]) => boolean;
    /** Recent transitions, oldest first. */
    history: readonly StateMachineHistoryEntry<S, E>[];
    /** Return to the initial state and clear the history. Runs exit and entry effects. */
    reset: () => void;
}

interface MachineSnapshot<S extends string, E extends string> {
    id: number;
    state: S;
    from: S | null;
    event: E | null;
    history: StateMachineHistoryEntry<S, E>[];
}

function resolveTarget<S extends string, E extends string>(
    config: StateMachineConfig<S, E>,
    from: S,
    event: E
): S | null {
    const node = config.states[from] as StateMachineStateConfig<S, E> | undefined;
    const transition = node?.on?.[event] as S | StateMachineTransition<S, E> | undefined;

    if (transition === undefined) {
        return null;
    }

    if (typeof transition === 'string') {
        return transition;
    }

    if (transition.guard && !transition.guard({from, event})) {
        return null;
    }

    return transition.target;
}

/**
 * A finite state machine from a typed config. State and event names are inferred from the config,
 * so `send('TYPO')` is a type error.
 * @example
 * const {state, send, can} = useStateMachine({
 *     initial: 'idle',
 *     states: {idle: {on: {FETCH: 'loading'}}, loading: {on: {DONE: 'idle'}}},
 * });
 */
export function useStateMachine<S extends string, E extends string>(
    config: StateMachineConfig<S, E>,
    options: StateMachineOptions = {}
): StateMachine<S, E> {
    const configRef = useLatest(config);
    const limitRef = useLatest(Math.max(0, options.historyLimit ?? 20));
    const [snapshot, setSnapshot] = useState<MachineSnapshot<S, E>>(() => ({
        id: 0,
        state: config.initial as S,
        from: null,
        event: null,
        history: [],
    }));
    // Updated synchronously so several sends in one tick chain correctly.
    const snapshotRef = useRef(snapshot);

    const commit = useCallback((next: MachineSnapshot<S, E>) => {
        snapshotRef.current = next;
        setSnapshot(next);
    }, []);

    const send = useCallback((event: E) => {
        const current = snapshotRef.current;
        const target = resolveTarget(configRef.current as StateMachineConfig<S, E>, current.state, event);

        if (target === null) {
            return false;
        }

        const limit = limitRef.current;
        const history = limit === 0
            ? []
            : [...current.history, {from: current.state, to: target, event, at: Date.now()}].slice(-limit);

        commit({id: current.id + 1, state: target, from: current.state, event, history});

        return true;
    }, [commit, configRef, limitRef]);

    const reset = useCallback(() => {
        const current = snapshotRef.current;

        commit({
            id: current.id + 1,
            state: configRef.current.initial as S,
            from: current.state,
            event: null,
            history: [],
        });
    }, [commit, configRef]);

    // Entry runs after each transition. Its cleanup runs the entry cleanup, then `exit` when a
    // newer snapshot exists (a transition), but not when the component unmounts.
    useEffect(() => {
        const entered = snapshot;
        const node = configRef.current.states[entered.state] as StateMachineStateConfig<S, E> | undefined;
        const cleanup = node?.entry?.({from: entered.from, to: entered.state, event: entered.event, send});

        return () => {
            if (typeof cleanup === 'function') {
                cleanup();
            }

            const next = snapshotRef.current;
            if (next.id !== entered.id) {
                const leaving = configRef.current.states[entered.state] as StateMachineStateConfig<S, E> | undefined;
                leaving?.exit?.({from: entered.state, to: next.state, event: next.event, send});
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapshot.id]);

    const state = snapshot.state;

    const can = useCallback(
        (event: E) => resolveTarget(config as StateMachineConfig<S, E>, state, event) !== null,
        [config, state]
    );

    const matches = useCallback((...states: S[]) => states.indexOf(state) !== -1, [state]);

    return {state, event: snapshot.event, send, can, matches, history: snapshot.history, reset};
}
