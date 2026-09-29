// SSR cases for the interaction hook group.
export const cases = {
    useResizeObserver: (lib) => lib.useResizeObserver({box: 'border-box'}),
    useMutationObserver: (lib, React) => {
        const ref = React.useRef(null);
        lib.useMutationObserver(ref, () => {}, {childList: true, attributes: true});
    },
    useDraggable: (lib) => lib.useDraggable({bounds: 'parent', grid: [20, 20], initial: {x: 40, y: 20}}),
    useVirtualList: (lib) => {
        const items = Array.from({length: 1000}, (_, i) => `Row ${i}`);
        const list = lib.useVirtualList(items, {itemHeight: (i) => (i % 3 === 0 ? 48 : 32), containerHeight: 320});
        if (list.virtualItems.length === 0) throw new Error('expected rows on the server');
    },
    useFocusTrap: (lib) => lib.useFocusTrap(true, {escapeDeactivates: true, onEscape: () => {}}),
    useHotkeys: (lib) => lib.useHotkeys('mod+k, g h, shift+/', () => {}),
    useScrollSpy: (lib, React) => {
        const root = React.useRef(null);
        lib.useScrollSpy(['intro', 'install', 'usage'], {root, offset: 48});
    },
    useTextSelection: (lib, React) => {
        const ref = React.useRef(null);
        lib.useTextSelection(ref);
    },
    useSwipe: (lib) => lib.useSwipe({axis: 'x', threshold: 60, onSwipeLeft: () => {}}),
    useRovingFocus: (lib) => {
        const roving = lib.useRovingFocus({count: 5, orientation: 'horizontal', isDisabled: (i) => i === 2});
        roving.getItemProps(0);
    },
    useTextareaAutosize: (lib) => lib.useTextareaAutosize({minRows: 2, maxRows: 6, value: 'Hello'}),
};
