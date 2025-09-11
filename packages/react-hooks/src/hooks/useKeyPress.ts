import {useEffect, useState} from 'react';

export function useKeyPress(targetKey: string) {
    const [pressed, setPressed] = useState(false);

    const downHandler = (event: KeyboardEvent) => {
        if (event.key === targetKey) {
            setPressed(true);
        }
    };

    const upHandler = (event: KeyboardEvent) => {
        if (event.key === targetKey) {
            setPressed(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [targetKey]);

    return pressed;
}
