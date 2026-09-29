import {useEffect, useState} from 'react';

/**
 * Return true while `targetKey` is held down. Compares against `KeyboardEvent.key`,
 * for example `'Enter'`, `'Shift'` or `'a'`. Resets when the window loses focus.
 * @example
 * const shiftHeld = useKeyPress('Shift');
 * <p>{shiftHeld ? 'Multi-select on' : 'Hold Shift to select several'}</p>
 */
export function useKeyPress(targetKey: string): boolean {
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        const downHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey) setPressed(true);
        };
        const upHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey) setPressed(false);
        };
        // A keyup that happens while another window has focus never reaches us.
        const reset = () => setPressed(false);

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        window.addEventListener('blur', reset);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
            window.removeEventListener('blur', reset);
            setPressed(false);
        };
    }, [targetKey]);

    return pressed;
}
