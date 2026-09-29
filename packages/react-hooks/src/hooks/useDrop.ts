import {useCallback, useMemo, useRef, useState} from 'react';
import type {DragEvent} from 'react';
import type {DropHandlers, DropResult, DropState} from '../types';

/**
 * Make an element a drop target for files, text or links. Spread `handlers` onto it.
 * `data` is a `FileList` when files are dropped, otherwise the dropped text or URL.
 * @example
 * const {isOver, data, handlers} = useDrop<HTMLDivElement>();
 * <div {...handlers}>{isOver ? 'Release to drop' : 'Drop here'}</div>
 */
export function useDrop<T extends HTMLElement = HTMLElement>(): DropResult<T> {
    const ref = useRef<T | null>(null);
    const [state, setState] = useState<DropState>({
        isOver: false,
        data: null,
    });
    // dragenter and dragleave also fire when moving over child elements.
    // Counting them keeps isOver true until the pointer really leaves.
    const depth = useRef(0);

    const setOver = useCallback((isOver: boolean) => {
        setState(prev => (prev.isOver === isOver ? prev : {...prev, isOver}));
    }, []);

    const onDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        depth.current += 1;
        setOver(true);
    }, [setOver]);

    const onDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setOver(true);
    }, [setOver]);

    const onDragLeave = useCallback(() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setOver(false);
    }, [setOver]);

    const onDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        depth.current = 0;

        let data: string | FileList | null = null;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            data = e.dataTransfer.files;
        } else {
            const text = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
            if (text) data = text;
        }

        setState({isOver: false, data});
    }, []);

    const handlers = useMemo<DropHandlers>(
        () => ({onDragEnter, onDragOver, onDragLeave, onDrop}),
        [onDragEnter, onDragOver, onDragLeave, onDrop]
    );

    return {ref, ...state, handlers};
}
