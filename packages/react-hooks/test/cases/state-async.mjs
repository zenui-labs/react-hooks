// SSR cases for the state-async hook group.
export const cases = {
    useStateHistory: (lib) => {
        const {state, canUndo} = lib.useStateHistory({text: ''}, {capacity: 50});
        if (state.text !== '' || canUndo) throw new Error('unexpected initial history');
    },
    useMap: (lib) => {
        const {size} = lib.useMap([['a', 1], ['b', 2]]);
        if (size !== 2) throw new Error('unexpected map size');
    },
    useSet: (lib) => {
        const {has} = lib.useSet(['react']);
        if (!has('react')) throw new Error('missing set item');
    },
    useQueue: (lib) => {
        const {first, size} = lib.useQueue(['job-1', 'job-2']);
        if (first !== 'job-1' || size !== 2) throw new Error('unexpected queue');
    },
    useStateMachine: (lib) => {
        const machine = lib.useStateMachine({
            initial: 'idle',
            states: {
                idle: {on: {FETCH: 'loading'}},
                loading: {on: {RESOLVE: 'success', REJECT: 'failure'}, entry: () => () => {}},
                success: {on: {RESET: 'idle'}},
                failure: {on: {RETRY: {target: 'loading', guard: () => true}}},
            },
        });
        if (machine.state !== 'idle' || !machine.can('FETCH') || machine.can('RESET')) {
            throw new Error('unexpected machine state');
        }
    },
    useBroadcastState: (lib) => {
        const [value, , meta] = lib.useBroadcastState('ssr-test', 1);
        if (value !== 1 || meta.isSupported) throw new Error('unexpected broadcast state');
    },
    useCachedFetch: (lib) => {
        lib.useCachedFetch('/api/user', () => Promise.resolve({id: 1}), {ttl: 1000});
        const paused = lib.useCachedFetch(null, () => Promise.resolve(1));
        if (paused.isLoading) throw new Error('paused fetch should not load');
    },
    useAsyncRetry: (lib) => {
        const {loading, attempts} = lib.useAsyncRetry(() => Promise.resolve(1), true, 2, (n) => n * 100);
        if (!loading || attempts !== 0) throw new Error('unexpected retry state');
    },
    useOptimisticState: (lib) => {
        const {value, isPending} = lib.useOptimisticState(3, (n, delta) => n + delta);
        if (value !== 3 || isPending) throw new Error('unexpected optimistic state');
    },
    useTaskQueue: (lib) => {
        const {running, pending} = lib.useTaskQueue({concurrency: 2});
        if (running !== 0 || pending !== 0) throw new Error('unexpected queue counts');
    },
    useDebouncedCallback: (lib) => {
        const fn = lib.useDebouncedCallback(() => {}, 300, {maxWait: 1000});
        if (typeof fn.cancel !== 'function' || fn.isPending()) throw new Error('bad debounced fn');
    },
    useThrottledCallback: (lib) => {
        const fn = lib.useThrottledCallback(() => {}, 100);
        if (typeof fn.flush !== 'function') throw new Error('bad throttled fn');
    },
};
