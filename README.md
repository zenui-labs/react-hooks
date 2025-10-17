![ZenUI-Labs React Hooks](https://i.ibb.co/qMr4pJGh/Group-1000006571.png)

# ZenUI React Hooks

A collection of **49 reusable React hooks** for modern web development, organized by categories for easy usage.

## Installation

```bash
npm install @zenuilabs/react-hooks
```

## Usage

```typescript
import {useLocalStorage, useDebounce, useToggle} from '@zenuilabs/react-hooks';

function MyComponent() {
    const [name, setName] = useLocalStorage('name', '');
    const debouncedName = useDebounce(name, 300);
    const {value: isVisible, toggle} = useToggle();

    return (
        <div>
            <input
                value = {name}
    onChange = {(e)
=>
    setName(e.target.value)
}
    placeholder = "Enter your name"
        / >
        <p>Debounced
:
    {
        debouncedName
    }
    </p>
    < button
    onClick = {toggle} > {isVisible ? 'Hide' : 'Show'} < /button>
    {
        isVisible && <p>Hello, {name}! < /p>}
        < /div>
    )
        ;
    }
```

---

## Available Hooks

### **State Management**

* **useLocalStorage** - Persist state in localStorage with JSON serialization, hydration, and cross-tab sync.
* **useSessionStorage** - Manage session-based state with automatic storage in sessionStorage.
* **useToggle** - Boolean state with toggle, setTrue, setFalse, and reset helpers.
* **useCounter** - Numeric counter with increment, decrement, reset, and custom step.
* **usePrevious** - Capture and return the previous value between renders.
* **useUpdate** - Force component re-renders programmatically.

### **Performance**

* **useDebounce** - Delay updates of rapidly changing values (perfect for search inputs or API calls).
* **useThrottle** - Limit the execution rate of a function or value updates.

### **Data Fetching**

* **useFetch** - Simplified data fetching with loading, error, and refetch support.
* **useAsync** - Run async functions with built-in loading, error, and result states.

### **DOM & Events**

* **useHover** - Track hover state with automatic cleanup.
* **useClickOutside** - Detect clicks outside a referenced element.
* **useWindowSize** - Track window dimensions with live updates.
* **useKeyPress** - Listen for key press events.
* **useLongPress** - Detect long press interactions on elements.
* **useScroll** - Track scroll positions (x, y) in real time.
* **useDrop** - Handle drag-and-drop files with drag state.
* **useDropArea** - Create a droppable area for files/content.
* **useEvent** - Subscribe and clean up DOM events safely.

### **Utilities**

* **useCopyToClipboard** - Copy text programmatically with success/error states.
* **useInterval** - Declarative interval with pause/resume/cleanup.
* **useCookie** - Read, write, and remove browser cookies.

### **Browser & Device**

* **useGeolocation** - Access user location with permission handling.
* **useHash** - Track and update URL hash values.
* **useIdle** - Detect user inactivity (idle state).
* **useIntersection** - Observe element visibility using IntersectionObserver.
* **useLocation** - Get and update current URL location.
* **useLockBodyScroll** - Prevent background scrolling for modals or drawers.
* **useMedia** - Match CSS media queries reactively.
* **useMediaDevices** - Access camera and microphone devices.
* **useMouse** - Track mouse position in real time.
* **useMouseWheel** - Listen to mouse wheel events with deltas.
* **useNetworkState** - Monitor online/offline status and connection type.
* **usePageLeave** - Detect mouse leaving the document (exit intent).
* **useSearchParam** - Read/update query parameters reactively.
* **useVisibilityChange** - Detect page visibility changes.

### **Media**

* **useVideo** - Control and track video playback (play, pause, state).
* **useAudio** - Manage audio playback and volume.
* **useFullscreen** - Toggle and track fullscreen mode on elements.

---

## Hook Examples

### **useLocalStorage**

```typescript
const {value, setValue} = useLocalStorage('myKey', 'defaultValue');
```

### **useDebounce**

```typescript
const debouncedValue = useDebounce(searchTerm, 300);
```

### **useToggle**

```typescript
const {value, toggle, setTrue, setFalse} = useToggle(false);
```

### **useCounter**

```typescript
const {count, increment, decrement, reset, set} = useCounter(0);
```

### **useFetch**

```typescript
const {data, loading, error, refetch} = useFetch('/api/data');
```

### **useHover**

```typescript
const {hoverRef, isHovered} = useHover();
```

### **useClickOutside**

```typescript
const ref = useClickOutside(() => setIsOpen(false));
```

### **useCopyToClipboard**

```typescript
const {isCopied, copyToClipboard} = useCopyToClipboard();
```

### **useWindowSize**

```typescript
const {width, height} = useWindowSize();
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-hook`)
3. add your hook to `packages/react-hooks/src/hooks`
4. add types if need in the `packages/react-hooks/src/types` folder
5. add the hook to the data for web playground in `src/data/index.ts` (following others data structure)
5. Add your hook example in `src/components/hook-examples`
6. import the playground demo component in `src/sections/hooks/hooks-details/hookDemo.tsx`
7. Update README with documentation
8. Commit (`git commit -m 'Add amazing hook'`)
9. Push (`git push origin feature/amazing-hook`)
10. Open a Pull Request

---

## License

MIT © [ZenUI Labs](https://zenui.net)

## Links

* [Website & Documentation](https://react-hooks.zenui.net/)
* [GitHub Repository](https://github.com/zenui-labs/react-hooks)
* [NPM Package](https://www.npmjs.com/package/@zenuilabs/react-hooks)
