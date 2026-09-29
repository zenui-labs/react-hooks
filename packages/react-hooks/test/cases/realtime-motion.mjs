// SSR cases for the realtime-motion hook group.
export const cases = {
    useWebSocket: (lib) => lib.useWebSocket('wss://echo.websocket.org', {reconnect: true, heartbeat: {interval: 10000}}),
    useEventSource: (lib) => lib.useEventSource('/api/stream', {events: ['price'], parse: JSON.parse}),
    usePolling: (lib) => lib.usePolling(async () => 1, {interval: 5000, backoff: {factor: 2, max: 60000}}),
    useInfiniteScroll: (lib, React) => {
        const root = React.useRef(null);
        lib.useInfiniteScroll({loadMore: async () => undefined, hasMore: true, root});
    },
    useCountdown: (lib) => lib.useCountdown(60 * 1000, {onComplete: () => undefined}),
    useStopwatch: (lib) => lib.useStopwatch({autoStart: true}),
    useTimeAgo: (lib) => lib.useTimeAgo(Date.now() - 5 * 60 * 1000, {locale: 'en'}),
    useAnimationFrame: (lib) => lib.useAnimationFrame(() => undefined),
    useSpringValue: (lib) => lib.useSpringValue(100, {stiffness: 200, damping: 20}),
    useWorker: (lib) => lib.useWorker((n) => n * 2, {timeout: 1000}),
};
