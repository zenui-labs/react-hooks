import {useCallback, useRef, useState} from 'react';
import {DropHandlers, DropState} from '../types';

export function useDrop<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const [state, setState] = useState<DropState>({
        isOver: false,
        data: null,
    });

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState((prev) => ({...prev, isOver: true}));
    }, []);

    const onDragLeave = useCallback(() => {
        setState((prev) => ({...prev, isOver: false}));
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();

        let data: string | FileList | null = null;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            data = e.dataTransfer.files;
        } else {
            const textData = e.dataTransfer.getData('text/plain');
            if (textData) {
                data = textData;
            }
        }

        setState({isOver: false, data});
    }, []);

    return {ref, ...state, handlers: {onDragOver, onDragLeave, onDrop} as DropHandlers};
}