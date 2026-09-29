![ZenUI React Hooks](https://i.ibb.co/qMr4pJGh/Group-1000006571.png)

# @zenuilabs/react-hooks

Typed React hooks for state, async data, realtime connections, gestures and browser APIs.

- **SSR-safe.** Every hook is rendered in plain Node in CI. Nothing touches `window` during render.
- **Zero dependencies.** Only `react` as a peer. Tree-shakeable ESM and CJS builds.
- **Ready for the App Router.** The bundle ships with `"use client"`, so you can import it from Next.js pages without a wrapper.
- **Typed end to end.** Options, results and generics are exported for every hook.

Docs, live demos and the full API: **[react-hooks.zenui.net](https://react-hooks.zenui.net)**

## Install

```bash
npm install @zenuilabs/react-hooks
```

`pnpm add`, `yarn add` and `bun add` work the same way. React 16.8 or newer is required. React 18 and 19 are tested.

## Quick start

```tsx
import {useDebounce, useLocalStorage, useToggle} from '@zenuilabs/react-hooks';

export function SearchBox() {
    const {storedValue: query, setValue: setQuery} = useLocalStorage('last-search', '');
    const debouncedQuery = useDebounce(query, 300);
    const {value: showHelp, toggle} = useToggle(false);

    return (
        <div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search"/>
            <p>Searching for: {debouncedQuery}</p>
            <button onClick={toggle}>{showHelp ? 'Hide help' : 'Show help'}</button>
            {showHelp && <p>Results update 300 ms after you stop typing.</p>}
        </div>
    );
}
```

## Hooks

<!-- hooks:start -->
91 hooks in 10 groups.

### State

| Hook | What it does |
| --- | --- |
| [`useBroadcastState`](https://react-hooks.zenui.net/hooks/usebroadcaststate) `new` | State that stays in sync across every open tab of your site. |
| [`useCounter`](https://react-hooks.zenui.net/hooks/usecounter) | Hold a number with stable increment, decrement, set and reset helpers. |
| [`useLocalStorage`](https://react-hooks.zenui.net/hooks/uselocalstorage) | Keep a piece of state in localStorage as JSON, synced across components and browser tabs. |
| [`useMap`](https://react-hooks.zenui.net/hooks/usemap) `new` | A Map in React state with immutable updates and stable action functions. |
| [`usePrevious`](https://react-hooks.zenui.net/hooks/useprevious) | Return the value a variable had on the previous render. |
| [`useQueue`](https://react-hooks.zenui.net/hooks/usequeue) `new` | A first-in, first-out queue in state. |
| [`useSessionStorage`](https://react-hooks.zenui.net/hooks/usesessionstorage) | Keep a piece of state in sessionStorage as JSON. |
| [`useSet`](https://react-hooks.zenui.net/hooks/useset) `new` | A Set in React state with add, remove and toggle. |
| [`useStateHistory`](https://react-hooks.zenui.net/hooks/usestatehistory) `new` | State with undo, redo and a browsable history. |
| [`useStateMachine`](https://react-hooks.zenui.net/hooks/usestatemachine) `new` | A finite state machine from a typed config, with guards and entry and exit effects. |
| [`useToggle`](https://react-hooks.zenui.net/hooks/usetoggle) | Hold a boolean with stable helpers to flip it, set it and reset it. |
| [`useUpdate`](https://react-hooks.zenui.net/hooks/useupdate) | Return a stable function that re-renders the component. |

### Async & Data

| Hook | What it does |
| --- | --- |
| [`useAsync`](https://react-hooks.zenui.net/hooks/useasync) | Run an async function and track its loading, error and data. |
| [`useAsyncRetry`](https://react-hooks.zenui.net/hooks/useasyncretry) | Run an async function and retry it when it fails, with a fixed delay or backoff. |
| [`useCachedFetch`](https://react-hooks.zenui.net/hooks/usecachedfetch) `new` | Stale-while-revalidate data fetching with a cache shared by every component. |
| [`useFetch`](https://react-hooks.zenui.net/hooks/usefetch) | Fetch JSON from a URL and track data, loading and error. |
| [`useInfiniteScroll`](https://react-hooks.zenui.net/hooks/useinfinitescroll) `new` | Load the next page when a sentinel element at the end of a list scrolls into view. |
| [`useOptimisticState`](https://react-hooks.zenui.net/hooks/useoptimisticstate) `new` | Show the result of an update immediately, run the real request, and roll back if it fails. |
| [`useTaskQueue`](https://react-hooks.zenui.net/hooks/usetaskqueue) `new` | Run async tasks in order with a limit on how many run at once. |

### Realtime

| Hook | What it does |
| --- | --- |
| [`useEventSource`](https://react-hooks.zenui.net/hooks/useeventsource) `new` | Subscribe to a Server-Sent Events stream and keep the latest event in state. |
| [`usePolling`](https://react-hooks.zenui.net/hooks/usepolling) `new` | Call an async function on an interval without overlapping calls. |
| [`useWebSocket`](https://react-hooks.zenui.net/hooks/usewebsocket) `new` | Connect to a WebSocket and track its status, the latest message and reconnect attempts. |

### Performance

| Hook | What it does |
| --- | --- |
| [`useDebounce`](https://react-hooks.zenui.net/hooks/usedebounce) | Return a copy of a value that only updates after it has stopped changing for a set time. |
| [`useDebouncedCallback`](https://react-hooks.zenui.net/hooks/usedebouncedcallback) `new` | Wrap a function so it only runs after calls stop for a given delay. |
| [`useThrottle`](https://react-hooks.zenui.net/hooks/usethrottle) | Return a copy of a fast-changing value that updates at most once per interval. |
| [`useThrottledCallback`](https://react-hooks.zenui.net/hooks/usethrottledcallback) `new` | Wrap a function so it runs at most once per interval while calls keep coming. |
| [`useVirtualList`](https://react-hooks.zenui.net/hooks/usevirtuallist) `new` | Render only the rows of a long list that are in view, with fixed or variable row heights. |
| [`useWorker`](https://react-hooks.zenui.net/hooks/useworker) `new` | Run a pure function in a Web Worker so heavy computation does not freeze the page. |

### Events & DOM

| Hook | What it does |
| --- | --- |
| [`useClickOutside`](https://react-hooks.zenui.net/hooks/useclickoutside) | Call a function when the user presses anywhere outside an element. |
| [`useEvent`](https://react-hooks.zenui.net/hooks/useevent) | Attach an event listener to the window, the document, an element or a ref, and remove it on unmount. |
| [`useHover`](https://react-hooks.zenui.net/hooks/usehover) | Track whether the pointer is over an element. |
| [`useIntersection`](https://react-hooks.zenui.net/hooks/useintersection) | Report whether an element is on screen using IntersectionObserver. |
| [`useKeyPress`](https://react-hooks.zenui.net/hooks/usekeypress) | Return true while a specific key is held down. |
| [`useLockBodyScroll`](https://react-hooks.zenui.net/hooks/uselockbodyscroll) | Stop the page behind a modal, drawer or menu from scrolling. |
| [`useMouse`](https://react-hooks.zenui.net/hooks/usemouse) | Track the pointer position in the viewport or relative to an element. |
| [`useMouseWheel`](https://react-hooks.zenui.net/hooks/usemousewheel) | Read the deltas of the latest wheel or trackpad scroll event, on the window or on one element. |
| [`useMutationObserver`](https://react-hooks.zenui.net/hooks/usemutationobserver) `new` | Watch a DOM node for added or removed children, attribute changes and text edits. |
| [`usePageLeave`](https://react-hooks.zenui.net/hooks/usepageleave) | Call a function when the pointer leaves the page, for example toward the tab bar. |
| [`useResizeObserver`](https://react-hooks.zenui.net/hooks/useresizeobserver) `new` | Track the size of an element with ResizeObserver, batched to one update per animation frame. |
| [`useScroll`](https://react-hooks.zenui.net/hooks/usescroll) | Track the scroll position and the direction of the last scroll, for the window or a scrollable element. |
| [`useScrollSpy`](https://react-hooks.zenui.net/hooks/usescrollspy) `new` | Return the id of the section currently in view, based on IntersectionObserver. |
| [`useTextSelection`](https://react-hooks.zenui.net/hooks/usetextselection) `new` | Track the text the user has selected and where it is on screen, optionally limited to one container. |
| [`useWindowSize`](https://react-hooks.zenui.net/hooks/usewindowsize) | Track the inner width and height of the browser window. |

### Interaction

| Hook | What it does |
| --- | --- |
| [`useDraggable`](https://react-hooks.zenui.net/hooks/usedraggable) `new` | Drag an element with mouse, touch or pen, with axis locking, bounds and grid snapping. |
| [`useDrop`](https://react-hooks.zenui.net/hooks/usedrop) | Turn an element into a drop target for files, text or links. |
| [`useDropArea`](https://react-hooks.zenui.net/hooks/usedroparea) | Turn an element into a drop zone for files, with optional type filtering. |
| [`useFocusTrap`](https://react-hooks.zenui.net/hooks/usefocustrap) `new` | Keep keyboard focus inside a container while it is active, and give focus back when it closes. |
| [`useHotkeys`](https://react-hooks.zenui.net/hooks/usehotkeys) `new` | Bind keyboard shortcuts, including combos like mod+k, several bindings at once and sequences like g h. |
| [`useLongPress`](https://react-hooks.zenui.net/hooks/uselongpress) | Call a function when an element is pressed and held for a set time, with mouse or touch. |
| [`useRovingFocus`](https://react-hooks.zenui.net/hooks/userovingfocus) `new` | Give a group of controls a single Tab stop and move between them with the arrow keys, Home and End. |
| [`useSwipe`](https://react-hooks.zenui.net/hooks/useswipe) `new` | Detect swipe gestures from mouse, touch or pen, with live offsets while the pointer moves. |
| [`useTextareaAutosize`](https://react-hooks.zenui.net/hooks/usetextareaautosize) `new` | Grow a textarea to fit its content between a minimum and maximum number of rows. |

### Browser & Device

| Hook | What it does |
| --- | --- |
| [`useBattery`](https://react-hooks.zenui.net/hooks/usebattery) `new` | Reads the battery level and charging state from the Battery Status API. |
| [`useBreakpoint`](https://react-hooks.zenui.net/hooks/usebreakpoint) `new` | Reports the active min-width breakpoint using matchMedia, so by default components re-render only when a breakpoint is crossed. |
| [`useColorScheme`](https://react-hooks.zenui.net/hooks/usecolorscheme) `new` | Stores a light, dark or system color scheme preference and resolves it against the OS setting. |
| [`useEyeDropper`](https://react-hooks.zenui.net/hooks/useeyedropper) `new` | Picks a color from anywhere on the screen with the EyeDropper API. |
| [`useFileDialog`](https://react-hooks.zenui.net/hooks/usefiledialog) `new` | Opens the native file picker without rendering a file input. |
| [`useGeolocation`](https://react-hooks.zenui.net/hooks/usegeolocation) | Watch the device position with the Geolocation API. |
| [`useHash`](https://react-hooks.zenui.net/hooks/usehash) | Read and update the URL hash. |
| [`useIdle`](https://react-hooks.zenui.net/hooks/useidle) | Report when the user has not moved the mouse, typed, scrolled or touched the page for a while. |
| [`useLocation`](https://react-hooks.zenui.net/hooks/uselocation) | Track the pathname, query string and hash of the current URL. |
| [`useMedia`](https://react-hooks.zenui.net/hooks/usemedia) | Track whether a CSS media query matches, such as a breakpoint, dark mode or reduced motion. |
| [`useMediaDevices`](https://react-hooks.zenui.net/hooks/usemediadevices) | List the cameras, microphones and speakers the browser can see, and refresh when one is plugged in or removed. |
| [`useNetworkState`](https://react-hooks.zenui.net/hooks/usenetworkstate) | Track whether the browser is online, when that last changed, and the connection quality where the browser reports it. |
| [`usePermission`](https://react-hooks.zenui.net/hooks/usepermission) `new` | Tracks the live state of a browser permission such as camera, microphone or geolocation. |
| [`useReducedMotion`](https://react-hooks.zenui.net/hooks/usereducedmotion) `new` | Returns true when the user has asked the OS to reduce motion. |
| [`useSearchParam`](https://react-hooks.zenui.net/hooks/usesearchparam) | Read and write one query string parameter. |
| [`useShare`](https://react-hooks.zenui.net/hooks/useshare) `new` | Opens the native share sheet with the Web Share API. |
| [`useVisibilityChange`](https://react-hooks.zenui.net/hooks/usevisibilitychange) | Track whether the page is visible or hidden in a background tab. |
| [`useWakeLock`](https://react-hooks.zenui.net/hooks/usewakelock) `new` | Keeps the screen from dimming with the Screen Wake Lock API. |

### Media

| Hook | What it does |
| --- | --- |
| [`useAudio`](https://react-hooks.zenui.net/hooks/useaudio) | Play a sound and track its playback state without rendering an audio element. |
| [`useFullscreen`](https://react-hooks.zenui.net/hooks/usefullscreen) | Show one element in fullscreen mode and track whether it is there. |
| [`useSpeechSynthesis`](https://react-hooks.zenui.net/hooks/usespeechsynthesis) `new` | Reads text aloud with the Web Speech API. |
| [`useVideo`](https://react-hooks.zenui.net/hooks/usevideo) | Control a video and track its playback state. |

### Time & Motion

| Hook | What it does |
| --- | --- |
| [`useAnimationFrame`](https://react-hooks.zenui.net/hooks/useanimationframe) `new` | Run a callback on every animation frame with the time since the previous frame. |
| [`useCountdown`](https://react-hooks.zenui.net/hooks/usecountdown) `new` | Count down to a date or through a duration and expose days, hours, minutes and seconds. |
| [`useInterval`](https://react-hooks.zenui.net/hooks/useinterval) | Run a callback on a fixed interval that pauses when the delay is null. |
| [`useSpringValue`](https://react-hooks.zenui.net/hooks/usespringvalue) `new` | Animate a number toward a target with spring physics. |
| [`useStopwatch`](https://react-hooks.zenui.net/hooks/usestopwatch) `new` | A stopwatch with start, pause, reset and laps. |
| [`useTimeAgo`](https://react-hooks.zenui.net/hooks/usetimeago) `new` | Format a date as relative time, such as "3 minutes ago" or "in 2 days", and keep it up to date. |

### Utilities

| Hook | What it does |
| --- | --- |
| [`useCookie`](https://react-hooks.zenui.net/hooks/usecookie) | Read and write one browser cookie as React state. |
| [`useCopyToClipboard`](https://react-hooks.zenui.net/hooks/usecopytoclipboard) | Copy text to the clipboard and get a short-lived flag for "Copied" feedback. |
| [`useDeepCompareEffect`](https://react-hooks.zenui.net/hooks/usedeepcompareeffect) `new` | Works like useEffect but compares dependencies by value. |
| [`useDocumentTitle`](https://react-hooks.zenui.net/hooks/usedocumenttitle) `new` | Sets document.title while the component is mounted and restores the previous title when it unmounts. |
| [`useEventCallback`](https://react-hooks.zenui.net/hooks/useeventcallback) `new` | Returns a function with a stable identity that always calls the latest version of your callback. |
| [`useIsClient`](https://react-hooks.zenui.net/hooks/useisclient) `new` | Returns false during server rendering and the first client render, then true. |
| [`useIsMounted`](https://react-hooks.zenui.net/hooks/useismounted) `new` | Returns a function that reports whether the component is still mounted. |
| [`useIsomorphicLayoutEffect`](https://react-hooks.zenui.net/hooks/useisomorphiclayouteffect) `new` | useLayoutEffect in the browser and useEffect on the server. |
| [`useLatest`](https://react-hooks.zenui.net/hooks/uselatest) `new` | Returns a ref that always holds the latest value. |
| [`useScript`](https://react-hooks.zenui.net/hooks/usescript) `new` | Loads an external script and reports its status. |
| [`useWhyDidYouUpdate`](https://react-hooks.zenui.net/hooks/usewhydidyouupdate) `new` | A development helper that reports which props changed since the last render. |
<!-- hooks:end -->

## Server rendering

Hooks return a stable default on the server and on the first client render, then read browser
state in an effect. That keeps hydration output identical. Hooks that wrap an optional browser
API (Battery, Wake Lock, EyeDropper, Web Share and others) return `isSupported: false` instead of
throwing when the API is missing.

## Upgrading from 2.0

2.1 is a drop-in upgrade. Every 2.0 export keeps its signature and return shape. Notable fixes:

- `useAudio`, `useVideo`, `useNetworkState`, `useVisibilityChange`, `useHash`, `useLocation`,
  `useSearchParam` and `useCookie` no longer throw during server rendering.
- `useAsyncRetry` is exported again. It was missing from the 2.0 source build.
- `usePageLeave` now detects the pointer leaving the page, as documented. It no longer registers a
  `beforeunload` handler that showed a "Leave site?" prompt.
- `useLocalStorage` syncs across tabs and hook instances, and its setter is stable.
- `useFetch` aborts stale requests and adds `refetch`.

See the [changelog](https://github.com/zenui-labs/react-hooks/releases) for the full list.

## License

MIT © [ZenUI Labs](https://zenui.net)
