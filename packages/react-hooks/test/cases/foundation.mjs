// SSR cases for the original hook set and shared foundation hooks.
export const cases = {
    useIsomorphicLayoutEffect: (lib) => lib.useIsomorphicLayoutEffect(() => undefined, []),
    useLatest: (lib) => lib.useLatest(1),
    useEventCallback: (lib) => lib.useEventCallback(() => 1),
    useIsClient: (lib) => lib.useIsClient(),
    useIsMounted: (lib) => lib.useIsMounted(),
};
