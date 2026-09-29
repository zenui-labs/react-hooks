import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export interface FileDialogOptions {
    /** Allowed types, as in the input `accept` attribute, e.g. `'image/*,.pdf'`. */
    accept?: string;
    /** Allow picking more than one file. Defaults to `false`. */
    multiple?: boolean;
    /** On mobile, open the camera or microphone directly. `'user'` is the front camera. */
    capture?: 'user' | 'environment';
}

export interface FileDialogResult {
    /** Files from the last pick. Empty until the user picks something. */
    files: File[];
    /** Open the picker. `overrides` apply to this call only. Call it from a user gesture. */
    open: (overrides?: FileDialogOptions) => void;
    /** Clear the picked files. */
    reset: () => void;
}

/**
 * Open the native file picker without rendering an `<input type="file">`.
 *
 * @example
 * const {files, open, reset} = useFileDialog({accept: 'image/*', multiple: true});
 * <button onClick={() => open()}>Choose photos</button>
 * <ul>{files.map((f) => <li key={f.name}>{f.name}</li>)}</ul>
 */
export function useFileDialog(options: FileDialogOptions = {}): FileDialogResult {
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const optionsRef = useLatest(options);

    useEffect(() => {
        return () => {
            if (inputRef.current) inputRef.current.onchange = null;
            inputRef.current = null;
        };
    }, []);

    const open = useCallback((overrides: FileDialogOptions = {}) => {
        if (!isBrowser) return;

        if (!inputRef.current) {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = () => setFiles(input.files ? Array.from(input.files) : []);
            inputRef.current = input;
        }

        const input = inputRef.current;
        const merged = {...optionsRef.current, ...overrides};
        input.accept = merged.accept ?? '';
        input.multiple = !!merged.multiple;
        if (merged.capture) input.setAttribute('capture', merged.capture);
        else input.removeAttribute('capture');
        // Clearing the value lets the change event fire when the same file is picked twice.
        input.value = '';
        input.click();
    }, [optionsRef]);

    const reset = useCallback(() => {
        setFiles([]);
        if (inputRef.current) inputRef.current.value = '';
    }, []);

    return {files, open, reset};
}
