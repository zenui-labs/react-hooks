export const hooksData: Record<string, any> = {
    uselocalstorage: {
        name: 'useLocalStorage',
        description: 'Persist state in localStorage with automatic JSON serialization and synchronization',
        category: 'State Management',
        usage: `import { useLocalStorage } from '@zenuilabs/react-hooks';

function MyComponent() {
  const [name, setName] = useLocalStorage('user-name', '');
  const [settings, setSettings] = useLocalStorage('settings', { theme: 'light' });
  
  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Stored name: {name}</p>
    </div>
  );
}`,
        api: [
            {param: 'key', type: 'string', description: 'The localStorage key to use'},
            {param: 'initialValue', type: 'T', description: 'Initial value if key doesn\'t exist'}
        ],
        returns: [
            {name: 'value', type: 'T', description: 'Current stored value'},
            {
                name: 'setValue',
                type: '(value: T | ((val: T) => T)) => void',
                description: 'Function to update the stored value'
            }
        ]
    },
    usedebounce: {
        name: 'useDebounce',
        description: 'Delay value updates until after a specified delay, perfect for search inputs',
        category: 'Performance',
        usage: `import { useDebounce } from '@zenuilabs/react-hooks';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
        api: [
            {param: 'value', type: 'T', description: 'The value to debounce'},
            {param: 'delay', type: 'number', description: 'Delay in milliseconds'}
        ],
        returns: [
            {name: 'debouncedValue', type: 'T', description: 'The debounced value'}
        ]
    },
    usetoggle: {
        name: 'useToggle',
        description: 'Manage boolean state with convenient helper functions for common operations',
        category: 'State Management',
        usage: `import { useToggle } from '@zenuilabs/react-hooks';

function ToggleComponent() {
  const { value: isVisible, toggle, setTrue, setFalse } = useToggle(false);
  
  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Show</button>
      <button onClick={setFalse}>Hide</button>
      {isVisible && <p>This content is visible!</p>}
    </div>
  );
}`,
        api: [
            {param: 'initialValue', type: 'boolean', description: 'Initial boolean value (default: false)'}
        ],
        returns: [
            {name: 'value', type: 'boolean', description: 'Current boolean value'},
            {name: 'toggle', type: '() => void', description: 'Function to toggle the value'},
            {name: 'setTrue', type: '() => void', description: 'Function to set value to true'},
            {name: 'setFalse', type: '() => void', description: 'Function to set value to false'}
        ]
    },
    usecounter: {
        name: 'useCounter',
        description: 'Counter state with increment, decrement, reset, and set operations',
        category: 'State Management',
        usage: `import { useCounter } from '@zenuilabs/react-hooks';

function CounterComponent() {
  const { count, increment, decrement, reset, set } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => set(10)}>Set to 10</button>
    </div>
  );
}`,
        api: [
            {param: 'initialValue', type: 'number', description: 'Initial counter value (default: 0)'}
        ],
        returns: [
            {name: 'count', type: 'number', description: 'Current counter value'},
            {name: 'increment', type: '() => void', description: 'Function to increment by 1'},
            {name: 'decrement', type: '() => void', description: 'Function to decrement by 1'},
            {name: 'reset', type: '() => void', description: 'Function to reset to initial value'},
            {name: 'set', type: '(value: number) => void', description: 'Function to set specific value'}
        ]
    },
    usefetch: {
        name: 'useFetch',
        description: 'Simple data fetching with loading states, error handling, and refetch functionality',
        category: 'Data Fetching',
        usage: `import { useFetch } from '@zenuilabs/react-hooks';

function DataComponent() {
  const { data, loading, error, refetch } = useFetch<User[]>('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
        api: [
            {param: 'url', type: 'string', description: 'The URL to fetch data from'}
        ],
        returns: [
            {name: 'data', type: 'T | null', description: 'The fetched data'},
            {name: 'loading', type: 'boolean', description: 'Loading state'},
            {name: 'error', type: 'Error | null', description: 'Error object if request failed'},
            {name: 'refetch', type: '() => void', description: 'Function to refetch data'}
        ]
    },
    usehover: {
        name: 'useHover',
        description: 'Track hover state of DOM elements with automatic event cleanup',
        category: 'DOM & Events',
        usage: `import { useHover } from '@zenuilabs/react-hooks';

function HoverComponent() {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();
  
  return (
    <div
      ref={hoverRef}
      style={{
        backgroundColor: isHovered ? 'lightblue' : 'lightgray',
        padding: '20px',
        transition: 'background-color 0.2s'
      }}
    >
      {isHovered ? 'Hovered!' : 'Hover over me'}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'ref', type: 'RefObject<T>', description: 'Ref to attach to the element'},
            {name: 'isHovered', type: 'boolean', description: 'Whether the element is being hovered'}
        ]
    },
    useclickoutside: {
        name: 'useClickOutside',
        description: 'Detect clicks outside a referenced element, useful for modals and dropdowns',
        category: 'DOM & Events',
        usage: `import { useClickOutside } from '@zenuilabs/react-hooks';

function DropdownComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="dropdown">
          <p>Dropdown content</p>
          <p>Click outside to close</p>
        </div>
      )}
    </div>
  );
}`,
        api: [
            {param: 'handler', type: '() => void', description: 'Function to call when clicking outside'}
        ],
        returns: [
            {name: 'ref', type: 'RefObject<T>', description: 'Ref to attach to the element'}
        ]
    },
    usecopytoclipboard: {
        name: 'useCopyToClipboard',
        description: 'Copy text to clipboard with feedback state and error handling',
        category: 'Utilities',
        usage: `import { useCopyToClipboard } from '@zenuilabs/react-hooks';

function CopyComponent() {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const textToCopy = 'Hello, World!';
  
  return (
    <div>
      <p>{textToCopy}</p>
      <button onClick={() => copyToClipboard(textToCopy)}>
        {isCopied ? 'Copied!' : 'Copy Text'}
      </button>
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isCopied', type: 'boolean', description: 'Whether text was recently copied (resets after 2s)'},
            {
                name: 'copyToClipboard',
                type: '(text: string) => Promise<boolean>',
                description: 'Function to copy text to clipboard'
            }
        ]
    },
    useinterval: {
        name: 'useInterval',
        description: 'Declarative interval hook with automatic cleanup and pause/resume capability',
        category: 'Utilities',
        usage: `import { useInterval } from '@zenuilabs/react-hooks';

function TimerComponent() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  
  useInterval(() => {
    setCount(count => count + 1);
  }, delay);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setDelay(delay === 1000 ? null : 1000)}>
        {delay ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}`,
        api: [
            {param: 'callback', type: '() => void', description: 'Function to call on each interval'},
            {param: 'delay', type: 'number | null', description: 'Delay in milliseconds, null to pause'}
        ],
        returns: []
    },
    usewindowsize: {
        name: 'useWindowSize',
        description: 'Track window dimensions with automatic updates on resize events',
        category: 'DOM & Events',
        usage: `import { useWindowSize } from '@zenuilabs/react-hooks';

function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width && width < 768 ? (
        <p>Mobile view</p>
      ) : (
        <p>Desktop view</p>
      )}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'width', type: 'number | undefined', description: 'Current window width'},
            {name: 'height', type: 'number | undefined', description: 'Current window height'}
        ]
    }
};

export const hooks = [
    {
        name: 'useLocalStorage',
        description: 'Persist state in localStorage with automatic JSON serialization and synchronization',
        category: 'State Management',
        slug: 'uselocalstorage'
    },
    {
        name: 'useDebounce',
        description: 'Delay value updates until after a specified delay, perfect for search inputs',
        category: 'Performance',
        slug: 'usedebounce'
    },
    {
        name: 'useToggle',
        description: 'Manage boolean state with convenient helper functions for common operations',
        category: 'State Management',
        slug: 'usetoggle'
    },
    {
        name: 'useCounter',
        description: 'Counter state with increment, decrement, reset, and set operations',
        category: 'State Management',
        slug: 'usecounter'
    },
    {
        name: 'useFetch',
        description: 'Simple data fetching with loading states, error handling, and refetch functionality',
        category: 'Data Fetching',
        slug: 'usefetch'
    },
    {
        name: 'useHover',
        description: 'Track hover state of DOM elements with automatic event cleanup',
        category: 'DOM & Events',
        slug: 'usehover'
    },
    {
        name: 'useClickOutside',
        description: 'Detect clicks outside a referenced element, useful for modals and dropdowns',
        category: 'DOM & Events',
        slug: 'useclickoutside'
    },
    {
        name: 'useCopyToClipboard',
        description: 'Copy text to clipboard with feedback state and error handling',
        category: 'Utilities',
        slug: 'usecopytoclipboard'
    },
    {
        name: 'useInterval',
        description: 'Declarative interval hook with automatic cleanup and pause/resume capability',
        category: 'Utilities',
        slug: 'useinterval'
    },
    {
        name: 'useWindowSize',
        description: 'Track window dimensions with automatic updates on resize events',
        category: 'DOM & Events',
        slug: 'usewindowsize'
    }
];