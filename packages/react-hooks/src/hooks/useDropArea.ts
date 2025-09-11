import {useCallback, useRef, useState} from 'react';
import {DropAreaHandlers, DropAreaState} from "../types";

export function useDropArea<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const [state, setState] = useState<DropAreaState>({isOver: false, files: []});

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState(prev => ({...prev, isOver: true}));
    }, []);

    const onDragLeave = useCallback(() => {
        setState(prev => ({...prev, isOver: false}));
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setState({isOver: false, files});
    }, []);

    return {ref, ...state, handlers: {onDragOver, onDragLeave, onDrop} as DropAreaHandlers};
}
