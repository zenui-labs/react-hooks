# @zenuilabs/react-hooks

A collection of reusable React hooks for modern web development.

## Installation

```bash
npm install @zenuilabs/react-hooks
```

## Usage

```typescript
import { useLocalStorage, useDebounce, useToggle } from '@zenuilabs/react-hooks';

function MyComponent() {
  const [name, setName] = useLocalStorage('name', '');
  const debouncedName = useDebounce(name, 300);
  const { value: isVisible, toggle } = useToggle();

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Debounced: {debouncedName}</p>
      <button onClick={toggle}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Hello, {name}!</p>}
    </div>
  );
}
```

## Available Hooks

### State Management
- **useLocalStorage** - Persist state in localStorage
- **useToggle** - Manage boolean state with helper functions
- **useCounter** - Counter with increment, decrement, reset, and set

### Performance
- **useDebounce** - Debounce rapidly changing values
- **useInterval** - Declarative interval hook

### DOM & Events
- **useHover** - Track hover state of an element
- **useClickOutside** - Detect clicks outside an element
- **useWindowSize** - Track window dimensions

### Utilities
- **useFetch** - Simple data fetching with loading and error states
- **useCopyToClipboard** - Copy text to clipboard with feedback

## Hook Details

### useLocalStorage(key, initialValue)
Synchronizes component state with localStorage.

```typescript
const [value, setValue] = useLocalStorage('myKey', 'defaultValue');
```

### useDebounce(value, delay)
Delays updating the returned value until after the delay has passed.

```typescript
const debouncedValue = useDebounce(searchTerm, 300);
```

### useToggle(initialValue)
Manages boolean state with convenient helper functions.

```typescript
const { value, toggle, setTrue, setFalse } = useToggle(false);
```

### useCounter(initialValue)
Manages numeric state with increment, decrement, reset, and set functions.

```typescript
const { count, increment, decrement, reset, set } = useCounter(0);
```

### useFetch(url)
Fetches data from a URL with loading and error states.

```typescript
const { data, loading, error, refetch } = useFetch('/api/data');
```

### useHover()
Tracks hover state of an element.

```typescript
const [hoverRef, isHovered] = useHover();
```

### useClickOutside(handler)
Calls handler when clicking outside the referenced element.

```typescript
const ref = useClickOutside(() => setIsOpen(false));
```

### useCopyToClipboard()
Provides function to copy text to clipboard with feedback.

```typescript
const { isCopied, copyToClipboard } = useCopyToClipboard();
```

### useInterval(callback, delay)
Declarative interval that handles cleanup automatically.

```typescript
useInterval(() => {
  console.log('This runs every second');
}, 1000);
```

### useWindowSize()
Returns current window dimensions.

```typescript
const { width, height } = useWindowSize();
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-hook`)
3. Add your hook in `src/hooks/`
4. Export it from `src/index.ts`
5. Add TypeScript types if needed
6. Update this README with documentation
7. Commit your changes (`git commit -m 'Add amazing hook'`)
8. Push to the branch (`git push origin feature/amazing-hook`)
9. Open a Pull Request

## License

MIT © ZenUI Labs

## Links

- [Website & Documentation](https://hooks.zenui.dev)
- [GitHub Repository](https://github.com/zenuilabs/react-hooks)
- [NPM Package](https://www.npmjs.com/package/@zenuilabs/react-hooks)