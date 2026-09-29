import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

// Shared across every instance so nested locks (a modal opening a drawer) restore
// the original styles only when the last lock is released.
let lockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

function acquire() {
    lockCount += 1;
    if (lockCount > 1) return;

    const {body, documentElement} = document;
    savedOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;

    // Hiding the scrollbar makes the page wider. Pad the body by the same amount to avoid a jump.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    if (scrollbarWidth > 0) {
        const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    body.style.overflow = 'hidden';
}

function release() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;

    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
}

/**
 * Prevent the page from scrolling while `lock` is true, for modals, drawers and full-screen menus.
 * Nested locks are counted, and the scrollbar width is padded to avoid a layout shift.
 * @example
 * const [open, setOpen] = useState(false);
 * useLockBodyScroll(open);
 */
export function useLockBodyScroll(lock: boolean = true) {
    useIsomorphicLayoutEffect(() => {
        if (!lock) return;

        acquire();
        return release;
    }, [lock]);
}
