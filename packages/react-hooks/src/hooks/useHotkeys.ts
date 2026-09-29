import {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {hasNavigator} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

/** Where to listen for keys: a ref, an element, or `window` (the default). */
export type HotkeysTarget = RefObject<EventTarget | null> | EventTarget | null;

export interface HotkeysOptions {
    /** Listen while true. Defaults to true. */
    enabled?: boolean;
    /** Call `preventDefault` on the event that completes a hotkey. Defaults to true. */
    preventDefault?: boolean;
    /** Also fire while typing in inputs, textareas, selects and contenteditable elements. Defaults to false. */
    enableOnFormFields?: boolean;
    /** Element to listen on. Defaults to `window`. */
    target?: HotkeysTarget;
    /** Maximum pause between the steps of a sequence, in milliseconds. Defaults to 1000. */
    sequenceTimeout?: number;
}

export interface HotkeysEventInfo {
    /** The binding that matched, as written, for example `'mod+k'` or `'g h'`. */
    hotkey: string;
}

export type HotkeysHandler = (event: KeyboardEvent, info: HotkeysEventInfo) => void;

export interface HotkeysResult {
    /** Steps typed so far of a sequence in progress, for example `['g']`. Empty when idle. */
    sequence: string[];
}

interface HotkeyStep {
    label: string;
    key: string;
    mod: boolean;
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    shift: boolean;
}

interface HotkeyBinding {
    hotkey: string;
    steps: HotkeyStep[];
}

const KEY_ALIASES: Record<string, string> = {
    ' ': 'space',
    spacebar: 'space',
    esc: 'escape',
    return: 'enter',
    del: 'delete',
    arrowup: 'up',
    arrowdown: 'down',
    arrowleft: 'left',
    arrowright: 'right',
    ',': 'comma',
    '+': 'plus',
};

const CODE_KEYS: Record<string, string> = {
    Slash: '/',
    Backslash: '\\',
    Period: '.',
    Comma: 'comma',
    Minus: '-',
    Equal: '=',
    Semicolon: ';',
    Quote: '\'',
    BracketLeft: '[',
    BracketRight: ']',
    Backquote: '`',
};

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'AltGraph', 'CapsLock', 'OS']);

function normalizeKey(key: string) {
    const lower = key.length === 1 ? key.toLowerCase() : key.toLowerCase().trim();
    return KEY_ALIASES[lower] ?? lower;
}

function codeToKey(code: string) {
    if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase();
    if (/^Digit[0-9]$/.test(code)) return code.slice(5);
    return CODE_KEYS[code] ?? '';
}

function parseStep(label: string): HotkeyStep {
    const step: HotkeyStep = {label, key: '', mod: false, ctrl: false, meta: false, alt: false, shift: false};
    for (const part of label.split('+')) {
        const token = part.trim().toLowerCase();
        if (token === 'mod') step.mod = true;
        else if (token === 'ctrl' || token === 'control') step.ctrl = true;
        else if (token === 'meta' || token === 'cmd' || token === 'command' || token === 'super') step.meta = true;
        else if (token === 'alt' || token === 'option' || token === 'opt') step.alt = true;
        else if (token === 'shift') step.shift = true;
        else if (token) step.key = normalizeKey(token);
    }
    return step;
}

/** Parse `'mod+k, g h'` into bindings. Use `comma` and `plus` for those keys. */
function parseHotkeys(keys: string): HotkeyBinding[] {
    return keys
        .split(',')
        .map((hotkey) => hotkey.trim())
        .filter(Boolean)
        .map((hotkey) => ({hotkey, steps: hotkey.split(/\s+/).map(parseStep)}))
        .filter((binding) => binding.steps.every((step) => step.key));
}

function isApplePlatform() {
    if (!hasNavigator) return false;
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}

const isSymbol = (key: string) => key.length === 1 && !/[a-z]/.test(key);

function matchesStep(step: HotkeyStep, event: KeyboardEvent, apple: boolean) {
    const wantCtrl = step.ctrl || (step.mod && !apple);
    const wantMeta = step.meta || (step.mod && apple);
    if (event.ctrlKey !== wantCtrl || event.metaKey !== wantMeta || event.altKey !== step.alt) return false;

    const key = normalizeKey(event.key);
    if (key === step.key) {
        // Symbols such as '?' already imply Shift, so 'shift+?' and '?' both match.
        return event.shiftKey === step.shift || (event.shiftKey && isSymbol(step.key));
    }

    // When a modifier changed the character (Alt on macOS, Shift on '/'), fall back to the physical key.
    // Letters are skipped so non-QWERTY layouts keep matching by the character they type.
    if (/^[a-z]$/.test(key)) return false;
    return codeToKey(event.code) === step.key && event.shiftKey === step.shift;
}

function isFormField(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
    if (target instanceof HTMLInputElement) {
        return !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file', 'image'].includes(target.type);
    }
    return false;
}

function resolveTarget(target: HotkeysTarget | undefined): EventTarget | null {
    if (target === undefined) return typeof window === 'undefined' ? null : window;
    if (!target) return null;
    if ('current' in target) return target.current ?? null;
    return target;
}

/**
 * Bind keyboard shortcuts: combos (`'mod+k'`), several bindings (`'mod+k, ctrl+p'`) and sequences (`'g h'`).
 * `mod` is Cmd on macOS and iOS, Ctrl elsewhere. Keys typed in form fields are ignored by default.
 * @example
 * useHotkeys('mod+k', () => setPaletteOpen(true));
 * useHotkeys('g h', () => navigate('/'));
 * const {sequence} = useHotkeys('shift+/', () => setHelpOpen(true));
 */
export function useHotkeys(
    keys: string | string[],
    handler: HotkeysHandler,
    options: HotkeysOptions = {}
): HotkeysResult {
    const {enabled = true, target, sequenceTimeout = 1000} = options;
    const keysKey = Array.isArray(keys) ? keys.join(',') : keys;
    const bindings = useMemo(() => parseHotkeys(keysKey), [keysKey]);

    const handlerRef = useLatest(handler);
    const optionsRef = useLatest(options);
    const sequenceKeyRef = useRef('');
    const [sequence, setSequence] = useState<string[]>([]);
    const [resolvedTarget, setResolvedTarget] = useState<EventTarget | null>(null);

    // Refs do not trigger renders, so re-resolve the target after every commit.
    useIsomorphicLayoutEffect(() => {
        setResolvedTarget(resolveTarget(target));
    });

    useEffect(() => {
        if (!enabled || !resolvedTarget || bindings.length === 0) return;

        const progress = bindings.map(() => 0);
        let lastTime = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const publish = (next: string[]) => {
            const key = next.join(' ');
            if (key === sequenceKeyRef.current) return;
            sequenceKeyRef.current = key;
            setSequence(next);
        };

        const resetProgress = () => {
            progress.fill(0);
            publish([]);
        };

        const onKeyDown = (event: Event) => {
            if (!(event instanceof KeyboardEvent)) return;
            if (!event.key || event.isComposing || MODIFIER_KEYS.has(event.key)) return;

            const opts = optionsRef.current;
            const origin = typeof event.composedPath === 'function' ? event.composedPath()[0] ?? event.target : event.target;
            if (!opts.enableOnFormFields && isFormField(origin)) return;

            const now = Date.now();
            if (now - lastTime > sequenceTimeout) progress.fill(0);
            lastTime = now;

            const apple = isApplePlatform();
            let matched: HotkeyBinding | null = null;

            for (let index = 0; index < bindings.length; index++) {
                const binding = bindings[index];
                let step = progress[index];
                if (step > 0 && !event.repeat && matchesStep(binding.steps[step], event, apple)) step += 1;
                else if (matchesStep(binding.steps[0], event, apple) && (!event.repeat || binding.steps.length === 1)) step = 1;
                else step = 0;

                // Fire once per key press, for the first binding that completes.
                if (step === binding.steps.length) {
                    if (!matched) matched = binding;
                    step = 0;
                }
                progress[index] = step;
            }

            if (timer) clearTimeout(timer);

            if (matched) {
                resetProgress();
                if (opts.preventDefault !== false) event.preventDefault();
                handlerRef.current(event, {hotkey: matched.hotkey});
                return;
            }

            let best = -1;
            progress.forEach((step, index) => {
                if (step > 0 && (best === -1 || step > progress[best])) best = index;
            });

            if (best === -1) {
                publish([]);
                return;
            }

            publish(bindings[best].steps.slice(0, progress[best]).map((step) => step.label));
            timer = setTimeout(resetProgress, sequenceTimeout);
        };

        resolvedTarget.addEventListener('keydown', onKeyDown);

        return () => {
            resolvedTarget.removeEventListener('keydown', onKeyDown);
            if (timer) clearTimeout(timer);
            sequenceKeyRef.current = '';
            setSequence([]);
        };
    }, [enabled, resolvedTarget, bindings, sequenceTimeout, handlerRef, optionsRef]);

    return {sequence};
}
