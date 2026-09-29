import {RefObject, useCallback, useEffect, useState} from 'react';
import {useLatest} from './useLatest';

/** Container to limit the selection to: a ref or an element. Omit it to track the whole document. */
export type TextSelectionTarget = RefObject<Element | null> | Element | null;

export interface TextSelectionState {
    /** Selected text, clipped to the container when one is given. */
    text: string;
    /** Bounding box of the selection in viewport coordinates, or `null` when nothing is selected. */
    rect: DOMRect | null;
    isCollapsed: boolean;
}

export interface TextSelectionResult extends TextSelectionState {
    /** Remove the current selection. */
    clear: () => void;
}

const EMPTY: TextSelectionState = {text: '', rect: null, isCollapsed: true};

function readSelection(target: TextSelectionTarget | undefined): TextSelectionState {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return EMPTY;

    let range = selection.getRangeAt(0);
    let text: string;

    if (!target) {
        text = selection.toString();
    } else {
        const container = 'current' in target ? target.current : target;
        if (!container || !range.intersectsNode(container)) return EMPTY;

        // Clip the range to the container, so a drag that runs past its edge still counts.
        const bounds = document.createRange();
        bounds.selectNodeContents(container);
        const clipped = range.cloneRange();
        if (clipped.compareBoundaryPoints(Range.START_TO_START, bounds) < 0) {
            clipped.setStart(bounds.startContainer, bounds.startOffset);
        }
        if (clipped.compareBoundaryPoints(Range.END_TO_END, bounds) > 0) {
            clipped.setEnd(bounds.endContainer, bounds.endOffset);
        }
        range = clipped;
        text = range.toString();
    }

    if (range.collapsed || !text) return EMPTY;
    return {text, rect: range.getBoundingClientRect(), isCollapsed: false};
}

function sameRect(a: DOMRect | null, b: DOMRect | null) {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

/**
 * Track the user's text selection: its text and position, optionally limited to a container.
 * The rect follows the selection on scroll and resize, so a floating toolbar can stay attached.
 * @example
 * const articleRef = useRef<HTMLElement>(null);
 * const {text, rect} = useTextSelection(articleRef);
 * return rect ? <Toolbar style={{top: rect.top - 40, left: rect.left}} quote={text}/> : null;
 */
export function useTextSelection(target?: TextSelectionTarget): TextSelectionResult {
    const [state, setState] = useState<TextSelectionState>(EMPTY);
    const targetRef = useLatest(target);

    useEffect(() => {
        let frame = 0;

        const read = () => {
            frame = 0;
            const next = readSelection(targetRef.current);
            setState((previous) =>
                previous.text === next.text && previous.isCollapsed === next.isCollapsed && sameRect(previous.rect, next.rect)
                    ? previous
                    : next
            );
        };

        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(read);
        };

        document.addEventListener('selectionchange', schedule);
        // Capture scrolls from any container so the rect stays current.
        window.addEventListener('scroll', schedule, {capture: true, passive: true});
        window.addEventListener('resize', schedule);
        schedule();

        return () => {
            document.removeEventListener('selectionchange', schedule);
            window.removeEventListener('scroll', schedule, {capture: true});
            window.removeEventListener('resize', schedule);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [targetRef]);

    const clear = useCallback(() => {
        window.getSelection()?.removeAllRanges();
    }, []);

    return {...state, clear};
}
