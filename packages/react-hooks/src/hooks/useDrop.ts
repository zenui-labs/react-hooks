import {useCallback, useRef, useState} from 'react';
import {DropHandlers, DropState} from "../types";

export function useDrop<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const [state, setState] = useState<DropState>({isOver: false, data: null});

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow drop
        setState(prev => ({...prev, isOver: true}));
    }, []);

    const onDragLeave = useCallback(() => {
        setState(prev => ({...prev, isOver: false}));
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text') || null;
        setState({isOver: false, data});
    }, []);

    return {ref, ...state, handlers: {onDragOver, onDragLeave, onDrop} as DropHandlers};
}
