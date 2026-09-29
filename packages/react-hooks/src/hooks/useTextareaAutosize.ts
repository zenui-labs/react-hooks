import {useCallback, useEffect, useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

export interface TextareaAutosizeOptions {
    /** Smallest height, in rows. Defaults to 1. */
    minRows?: number;
    /** Largest height, in rows. The textarea scrolls past this. Defaults to no limit. */
    maxRows?: number;
    /** Pass a controlled value so programmatic changes also resize. Typing is picked up either way. */
    value?: string;
}

export interface TextareaAutosizeResult {
    /** Callback ref for the textarea. */
    ref: (node: HTMLTextAreaElement | null) => void;
    /** Current height in pixels, including padding and border for `border-box`. 0 before mount. */
    height: number;
    /** Number of visible rows. */
    rows: number;
    /** Measure again, for example after changing the font with a class. */
    recalculate: () => void;
}

// Styles that affect how text wraps, copied onto a hidden twin used for measuring.
const COPIED_STYLES = [
    'box-sizing', 'width', 'font-family', 'font-size', 'font-style', 'font-weight', 'font-variant',
    'font-stretch', 'letter-spacing', 'line-height', 'text-indent', 'text-transform', 'text-rendering',
    'word-break', 'word-spacing', 'white-space', 'overflow-wrap', 'tab-size', 'direction',
    'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
    'border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width',
];

const HIDDEN_STYLES: Record<string, string> = {
    'min-height': '0',
    'max-height': 'none',
    height: '0',
    visibility: 'hidden',
    overflow: 'hidden',
    position: 'absolute',
    'z-index': '-1000',
    top: '0',
    right: '0',
    'pointer-events': 'none',
};

let twin: HTMLTextAreaElement | null = null;

function measure(element: HTMLTextAreaElement, minRows: number, maxRows: number) {
    if (!twin) {
        twin = document.createElement('textarea');
        twin.setAttribute('tabindex', '-1');
        twin.setAttribute('aria-hidden', 'true');
    }
    if (!twin.isConnected) document.body.appendChild(twin);

    const style = window.getComputedStyle(element);
    for (const property of COPIED_STYLES) twin.style.setProperty(property, style.getPropertyValue(property));
    for (const [property, value] of Object.entries(HIDDEN_STYLES)) twin.style.setProperty(property, value, 'important');

    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const borderY = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

    twin.value = 'x';
    const rowHeight = twin.scrollHeight - paddingY;
    twin.value = element.value || element.placeholder || 'x';
    const contentHeight = twin.scrollHeight - paddingY;
    // Do not leave the user's text sitting in a detached corner of the DOM.
    twin.value = '';

    if (rowHeight <= 0) return null;

    const min = Math.max(1, minRows) * rowHeight;
    const max = Math.max(minRows, maxRows) * rowHeight;
    const inner = Math.min(max, Math.max(min, contentHeight));
    const outer = inner + (style.boxSizing === 'border-box' ? paddingY + borderY : 0);

    return {height: outer, rows: Math.round(inner / rowHeight), overflow: contentHeight > max};
}

/**
 * Grow a textarea to fit its content, between `minRows` and `maxRows`.
 * Re-measures on input, on value changes, when the width changes and when web fonts load.
 * @example
 * const [text, setText] = useState('');
 * const {ref} = useTextareaAutosize({minRows: 2, maxRows: 8, value: text});
 * return <textarea ref={ref} value={text} onChange={(e) => setText(e.target.value)}/>;
 */
export function useTextareaAutosize(options: TextareaAutosizeOptions = {}): TextareaAutosizeResult {
    const {minRows = 1, maxRows = Infinity, value} = options;
    const rowsRef = useLatest({minRows, maxRows});
    const nodeRef = useRef<HTMLTextAreaElement | null>(null);
    const [node, setNode] = useState<HTMLTextAreaElement | null>(null);
    const [size, setSize] = useState({height: 0, rows: Math.max(1, minRows)});

    const ref = useCallback((element: HTMLTextAreaElement | null) => {
        nodeRef.current = element;
        setNode(element);
    }, []);

    const recalculate = useCallback(() => {
        const element = nodeRef.current;
        if (!element || !element.isConnected) return;
        const result = measure(element, rowsRef.current.minRows, rowsRef.current.maxRows);
        if (!result) return;
        element.style.height = `${result.height}px`;
        element.style.overflowY = result.overflow ? 'auto' : 'hidden';
        setSize((previous) =>
            previous.height === result.height && previous.rows === result.rows
                ? previous
                : {height: result.height, rows: result.rows}
        );
    }, [rowsRef]);

    useIsomorphicLayoutEffect(() => {
        recalculate();
    }, [node, value, minRows, maxRows, recalculate]);

    useEffect(() => {
        if (!node) return;

        node.addEventListener('input', recalculate);

        // Only width changes re-wrap text; our own height changes are ignored to avoid a loop.
        let frame = 0;
        let lastWidth = node.getBoundingClientRect().width;
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
            const width = node.getBoundingClientRect().width;
            if (width === lastWidth) return;
            lastWidth = width;
            if (!frame) {
                frame = requestAnimationFrame(() => {
                    frame = 0;
                    recalculate();
                });
            }
        });
        observer?.observe(node);

        const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
        fonts?.addEventListener?.('loadingdone', recalculate);

        return () => {
            node.removeEventListener('input', recalculate);
            observer?.disconnect();
            if (frame) cancelAnimationFrame(frame);
            fonts?.removeEventListener?.('loadingdone', recalculate);
        };
    }, [node, recalculate]);

    return {ref, height: size.height, rows: size.rows, recalculate};
}
