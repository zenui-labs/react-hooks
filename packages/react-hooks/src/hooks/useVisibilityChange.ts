import {useEffect, useState} from 'react';
import {VisibilityState} from "../types";

export function useVisibilityChange(): VisibilityState {
    const [state, setState] = useState<VisibilityState>({
        visible: !document.hidden,
        hidden: document.hidden,
    });

    useEffect(() => {
        const handleVisibilityChange = () => {
            setState({
                visible: !document.hidden,
                hidden: document.hidden,
            });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return state;
}
