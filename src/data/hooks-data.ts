export const hooks = [
    {
        name: 'useLocalStorage',
        description: 'Persist state in localStorage with automatic JSON serialization, hydration, and synchronization across tabs.',
        category: 'State Management',
        slug: 'uselocalstorage',
        mostUse: true
    },
    {
        name: 'useSessionStorage',
        description: 'Manage session-based state with automatic storage in sessionStorage and seamless JSON handling.',
        category: 'State Management',
        slug: 'usesessionstorage',
        mostUse: true
    },
    {
        name: 'useToggle',
        description: 'Handle boolean state with toggle, setTrue, setFalse, and reset helpers for quick state changes.',
        category: 'State Management',
        slug: 'usetoggle',
        mostUse: true
    },
    {
        name: 'useCounter',
        description: 'Create a counter with increment, decrement, reset, and custom step operations.',
        category: 'State Management',
        slug: 'usecounter',
        mostUse: true
    },
    {
        name: 'usePrevious',
        description: 'Capture and return the previous value of a variable between renders.',
        category: 'State Management',
        slug: 'useprevious'
    },
    {
        name: 'useUpdate',
        description: 'Force component re-renders programmatically, ideal for refreshing UI manually.',
        category: 'State Management',
        slug: 'useupdate'
    },

    {
        name: 'useDebounce',
        description: 'Delay updates of rapidly changing values until after a specified wait time, perfect for search inputs and API calls.',
        category: 'Performance',
        slug: 'usedebounce',
        mostUse: true
    },
    {
        name: 'useThrottle',
        description: 'Limit the execution rate of a function or value updates to improve performance.',
        category: 'Performance',
        slug: 'usethrottle',
        mostUse: true
    },

    {
        name: 'useFetch',
        description: 'Simplified data fetching with built-in loading, error, and refetch support.',
        category: 'Data Fetching',
        slug: 'usefetch',
        mostUse: true
    },
    {
        name: 'useAsync',
        description: 'Run async functions with built-in states for loading, error, and result values.',
        category: 'Data Fetching',
        slug: 'useasync'
    },
    {
        name: 'useHover',
        description: 'Track hover state of an element with cleanup for mouse enter/leave events.',
        category: 'DOM & Events',
        slug: 'usehover'
    },
    {
        name: 'useClickOutside',
        description: 'Detect and respond when clicks happen outside a referenced element.',
        category: 'DOM & Events',
        slug: 'useclickoutside',
        mostUse: true
    },
    {
        name: 'useWindowSize',
        description: 'Track real-time window width and height with automatic resize updates.',
        category: 'DOM & Events',
        slug: 'usewindowsize',
        mostUse: true
    },
    {
        name: 'useKeyPress',
        description: 'Listen for key press events and trigger callbacks or state updates.',
        category: 'DOM & Events',
        slug: 'usekeypress'
    },
    {
        name: 'useLongPress',
        description: 'Detect long press interactions on elements with customizable duration.',
        category: 'DOM & Events',
        slug: 'uselongpress'
    },
    {
        name: 'useScroll',
        description: 'Track scroll position (x, y) with automatic updates on scroll events.',
        category: 'DOM & Events',
        slug: 'usescroll'
    },
    {
        name: 'useDrop',
        description: 'Handle drag-and-drop files with built-in drag state tracking.',
        category: 'DOM & Events',
        slug: 'usedrop'
    },
    {
        name: 'useDropArea',
        description: 'Create a droppable area to handle files and content dropped by users.',
        category: 'DOM & Events',
        slug: 'usedroparea'
    },
    {
        name: 'useEvent',
        description: 'Subscribe to and clean up DOM events with ease and safety.',
        category: 'DOM & Events',
        slug: 'useevent'
    },

    {
        name: 'useCopyToClipboard',
        description: 'Copy text to clipboard programmatically with success and error states.',
        category: 'Utilities',
        slug: 'usecopytoclipboard'
    },
    {
        name: 'useInterval',
        description: 'Set up intervals declaratively with pause, resume, and cleanup features.',
        category: 'Utilities',
        slug: 'useinterval'
    },
    {
        name: 'useCookie',
        description: 'Manage browser cookies with read, write, and remove utilities.',
        category: 'Utilities',
        slug: 'usecookie'
    },

    {
        name: 'useGeolocation',
        description: 'Access user location with real-time updates and permission handling.',
        category: 'Browser & Device',
        slug: 'usegeolocation'
    },
    {
        name: 'useHash',
        description: 'Track and update the current URL hash value with reactivity.',
        category: 'Browser & Device',
        slug: 'usehash'
    },
    {
        name: 'useIdle',
        description: 'Detect user inactivity (idle state) with customizable timeout.',
        category: 'Browser & Device',
        slug: 'useidle'
    },
    {
        name: 'useIntersection',
        description: 'Track element visibility within the viewport using Intersection Observer.',
        category: 'Browser & Device',
        slug: 'useintersection'
    },
    {
        name: 'useLocation',
        description: 'Get and update current URL location with path, search, and hash values.',
        category: 'Browser & Device',
        slug: 'uselocation'
    },
    {
        name: 'useLockBodyScroll',
        description: 'Prevent background scrolling when modals or drawers are open.',
        category: 'Browser & Device',
        slug: 'uselockbodyscroll'
    },
    {
        name: 'useMedia',
        description: 'Match CSS media queries in React and update UI responsively.',
        category: 'Browser & Device',
        slug: 'usemedia'
    },
    {
        name: 'useMediaDevices',
        description: 'Access media devices like camera and microphone with permissions.',
        category: 'Browser & Device',
        slug: 'usemediadevices'
    },
    {
        name: 'useMouse',
        description: 'Track mouse position with x, y coordinates updated in real time.',
        category: 'Browser & Device',
        slug: 'usemouse'
    },
    {
        name: 'useMouseWheel',
        description: 'Listen to and handle mouse wheel events with deltas for custom scrolling.',
        category: 'Browser & Device',
        slug: 'usemousewheel'
    },
    {
        name: 'useNetworkState',
        description: 'Monitor online/offline network status and effective connection type.',
        category: 'Browser & Device',
        slug: 'usenetworkstate'
    },
    {
        name: 'usePageLeave',
        description: 'Detect when the user’s mouse leaves the document (exit intent).',
        category: 'Browser & Device',
        slug: 'usepageleave'
    },
    {
        name: 'useSearchParam',
        description: 'Read and update query parameters in the URL reactively.',
        category: 'Browser & Device',
        slug: 'usesearchparam'
    },
    {
        name: 'useVisibilityChange',
        description: 'Detect when the page becomes visible or hidden using Page Visibility API.',
        category: 'Browser & Device',
        slug: 'usevisibilitychange'
    },

    {
        name: 'useVideo',
        description: 'Control and track video element playback with play, pause, and state updates.',
        category: 'Media',
        slug: 'usevideo'
    },
    {
        name: 'useAudio',
        description: 'Manage audio playback with state for playing, paused, and volume control.',
        category: 'Media',
        slug: 'useaudio'
    },
    {
        name: 'useFullscreen',
        description: 'Toggle and track fullscreen mode on elements with exit handling.',
        category: 'Media',
        slug: 'usefullscreen'
    }
];