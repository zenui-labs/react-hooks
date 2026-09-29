// SSR cases for the core-a hook group (original hooks).
export const cases = {
    useLocalStorage: (lib) => {
        const {storedValue, setValue, remove} = lib.useLocalStorage('theme', 'light');
        if (storedValue !== 'light') throw new Error('useLocalStorage must return initialValue on the server');
        if (typeof setValue !== 'function' || typeof remove !== 'function') throw new Error('missing setters');
    },
    useSessionStorage: (lib) => {
        const {value} = lib.useSessionStorage('step', 1);
        if (value !== 1) throw new Error('useSessionStorage must return initialValue on the server');
    },
    useDebounce: (lib) => lib.useDebounce('query', 300),
    useToggle: (lib) => lib.useToggle(true),
    useCounter: (lib) => {
        const {count} = lib.useCounter(20, {min: 0, max: 10, step: 2});
        if (count !== 10) throw new Error('useCounter must clamp the initial value');
    },
    usePrevious: (lib) => lib.usePrevious(1),
    useUpdate: (lib) => lib.useUpdate(),
    useThrottle: (lib) => lib.useThrottle(1, 200),
    useFetch: (lib) => {
        const {loading, refetch} = lib.useFetch('https://example.com/data.json', {headers: {Accept: 'application/json'}});
        if (loading !== true || typeof refetch !== 'function') throw new Error('unexpected useFetch state');
    },
    useAsync: (lib) => lib.useAsync(async () => 1, true),
    useHover: (lib) => lib.useHover(),
    useClickOutside: (lib, React) => lib.useClickOutside(React.useRef(null), () => undefined),
    useWindowSize: (lib) => {
        const {width, height} = lib.useWindowSize();
        if (width !== 0 || height !== 0) throw new Error('useWindowSize must be 0 x 0 on the server');
    },
    useKeyPress: (lib) => lib.useKeyPress('Enter'),
    useLongPress: (lib) => lib.useLongPress(() => undefined, {delay: 400}),
    useScroll: (lib, React) => {
        lib.useScroll();
        lib.useScroll(React.useRef(null));
    },
    useDrop: (lib) => lib.useDrop(),
    useDropArea: (lib) => lib.useDropArea({accept: ['image/*'], multiple: false}),
    useEvent: (lib, React) => {
        lib.useEvent('resize', () => undefined);
        lib.useEvent('click', () => undefined, React.useRef(null), {passive: true});
    },
};
