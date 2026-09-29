import {useCallback, useMemo, useRef, useState} from 'react';
import type {DragEvent} from 'react';
import type {DropAreaHandlers, DropAreaOptions, DropAreaResult} from '../types';
import {useLatest} from './useLatest';

/** Match a file against `accept` entries: `.ext`, `type/*` or an exact MIME type. */
function matchesAccept(file: File, accept: string[] | undefined): boolean {
    if (!accept || accept.length === 0) return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return accept.some((raw) => {
        const rule = raw.trim().toLowerCase();
        if (!rule) return false;
        if (rule.startsWith('.')) return name.endsWith(rule);
        if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
        return type === rule;
    });
}

/**
 * Make an element a drop zone for files. Spread `handlers` onto it.
 * Filter by type with `accept` and keep a single file with `multiple: false`.
 * @example
 * const {isOver, files, rejected, handlers} = useDropArea({accept: ['image/*']});
 * <div {...handlers}>{isOver ? 'Release to upload' : 'Drop images here'}</div>
 */
export function useDropArea<T extends HTMLElement = HTMLElement>(options: DropAreaOptions = {}): DropAreaResult<T> {
    const ref = useRef<T | null>(null);
    const [isOver, setIsOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [rejected, setRejected] = useState<File[]>([]);
    const optionsRef = useLatest(options);
    // Counts dragenter minus dragleave so moving over child elements does not flicker.
    const depth = useRef(0);

    const onDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        depth.current += 1;
        setIsOver(true);
    }, []);

    const onDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsOver(true);
    }, []);

    const onDragLeave = useCallback(() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setIsOver(false);
    }, []);

    const onDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        depth.current = 0;
        setIsOver(false);

        const {accept, multiple = true} = optionsRef.current;
        const dropped = Array.from(e.dataTransfer.files);
        const accepted = dropped.filter((file) => matchesAccept(file, accept));

        setFiles(multiple ? accepted : accepted.slice(0, 1));
        setRejected(dropped.filter((file) => !matchesAccept(file, accept)));
    }, [optionsRef]);

    const clear = useCallback(() => {
        setFiles([]);
        setRejected([]);
    }, []);

    const handlers = useMemo<DropAreaHandlers>(
        () => ({onDragEnter, onDragOver, onDragLeave, onDrop}),
        [onDragEnter, onDragOver, onDragLeave, onDrop]
    );

    return {ref, isOver, files, rejected, handlers, clear};
}
