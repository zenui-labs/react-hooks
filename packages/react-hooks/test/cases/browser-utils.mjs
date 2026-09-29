// SSR cases for the browser-utils hook group.
export const cases = {
    usePermission: (lib) => lib.usePermission('geolocation'),
    useBattery: (lib) => lib.useBattery(),
    useColorScheme: (lib) => lib.useColorScheme({storageKey: 'ssr-color-scheme'}),
    useReducedMotion: (lib) => lib.useReducedMotion(),
    useWakeLock: (lib) => lib.useWakeLock(),
    useSpeechSynthesis: (lib) => lib.useSpeechSynthesis(),
    useShare: (lib) => lib.useShare(),
    useEyeDropper: (lib) => lib.useEyeDropper(),
    useFileDialog: (lib) => lib.useFileDialog({accept: 'image/*', multiple: true}),
    useDocumentTitle: (lib) => lib.useDocumentTitle('Inbox'),
    useScript: (lib) => lib.useScript('https://cdn.example.com/widget.js', {removeOnUnmount: true}),
    useBreakpoint: (lib) => {
        lib.useBreakpoint({mobile: 0, tablet: 768, desktop: 1200});
        lib.useBreakpoint(undefined, {trackWidth: true});
    },
    useDeepCompareEffect: (lib) => lib.useDeepCompareEffect(() => undefined, [{page: 1, tags: ['a']}]),
    useWhyDidYouUpdate: (lib) => lib.useWhyDidYouUpdate('Probe', {count: 1, label: 'x'}),
};
