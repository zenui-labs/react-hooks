import type {HookDoc} from "@/types";

export const coreAHooks: Record<string, HookDoc> = {
    uselocalstorage: {
        name: 'useLocalStorage',
        description: 'Keep a piece of state in localStorage as JSON, synced across components and browser tabs. Use it for preferences and drafts that should survive a reload.',
        category: 'State',
        level: 'intermediate',
        popular: true,
        since: '1.0.0',
        signature: 'useLocalStorage<T>(key: string, initialValue: T): LocalStorageResult<T>',
        usage: `import {useLocalStorage} from '@zenuilabs/react-hooks';

type Theme = 'light' | 'dark';

export default function App() {
  const {storedValue: theme, setValue: setTheme, remove} = useLocalStorage<Theme>('theme', 'light');

  return (
    <main style={{background: theme === 'dark' ? '#111' : '#fff', color: theme === 'dark' ? '#eee' : '#111', padding: 24}}>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}>
        Switch theme
      </button>
      <button onClick={remove}>Forget my choice</button>
      <p>Reload the page. Your choice is still here.</p>
    </main>
  );
}`,
        api: [
            {param: 'key', type: 'string', description: 'The localStorage key. Changing it reads the value stored under the new key.'},
            {
                param: 'initialValue',
                type: 'T',
                description: 'Returned when nothing is stored under the key, on the server, and on the first client render.'
            },
        ],
        returns: [
            {
                name: 'storedValue',
                type: 'T',
                description: 'The current value. It equals initialValue during the first render, then switches to the stored value in a layout effect before the browser paints, so server and client markup match.'
            },
            {
                name: 'setValue',
                type: '(value: T | ((prev: T) => T)) => void',
                description: 'Stable function that updates state and writes JSON to localStorage. Updater functions always receive the latest value, even when called several times in a row. Other hook instances with the same key, including ones in other tabs, update too.'
            },
            {
                name: 'remove',
                type: '() => void',
                description: 'Stable function that deletes the key and resets every instance to initialValue.'
            },
        ],
    },
    usesessionstorage: {
        name: 'useSessionStorage',
        description: 'Keep a piece of state in sessionStorage as JSON. The value survives a reload but is cleared when the tab closes, which suits wizard steps and temporary form input.',
        category: 'State',
        level: 'intermediate',
        popular: true,
        since: '1.0.0',
        signature: 'useSessionStorage<T>(key: string, initialValue: T): SessionStorageResult<T>',
        usage: `import {useSessionStorage} from '@zenuilabs/react-hooks';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Review'];

export default function App() {
  const {value: step, setValue: setStep, remove} = useSessionStorage('checkout-step', 0);

  return (
    <section>
      <h2>Step {step + 1} of {STEPS.length}: {STEPS[step]}</h2>
      <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
        Back
      </button>
      <button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
        Next
      </button>
      <button onClick={remove}>Start over</button>
    </section>
  );
}`,
        api: [
            {param: 'key', type: 'string', description: 'The sessionStorage key. Changing it reads the value stored under the new key.'},
            {
                param: 'initialValue',
                type: 'T',
                description: 'Returned when nothing is stored under the key, on the server, and on the first client render.'
            },
        ],
        returns: [
            {
                name: 'value',
                type: 'T',
                description: 'The current value. It equals initialValue during the first render, then switches to the stored value before the browser paints.'
            },
            {
                name: 'setValue',
                type: '(value: T | ((prev: T) => T)) => void',
                description: 'Stable function that updates state and writes JSON to sessionStorage. Other instances with the same key in the tab update too.'
            },
            {
                name: 'remove',
                type: '() => void',
                description: 'Stable function that deletes the key and resets the value to initialValue.'
            },
        ],
    },
    usedebounce: {
        name: 'useDebounce',
        description: 'Return a copy of a value that only updates after it has stopped changing for a set time. Use it to wait for the user to pause before searching or saving.',
        category: 'Performance',
        level: 'basic',
        popular: true,
        since: '1.0.0',
        signature: 'useDebounce<T>(value: T, delay: number): T',
        usage: `import {useEffect, useState} from 'react';
import {useDebounce} from '@zenuilabs/react-hooks';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    fetch(\`https://dummyjson.com/products/search?q=\${encodeURIComponent(debouncedQuery)}\`)
      .then((res) => res.json())
      .then((json) => setResults(json.products.map((p: {title: string}) => p.title)));
  }, [debouncedQuery]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" />
      <ul>
        {results.map((title) => <li key={title}>{title}</li>)}
      </ul>
    </div>
  );
}`,
        api: [
            {param: 'value', type: 'T', description: 'The value to debounce.'},
            {
                param: 'delay',
                type: 'number',
                description: 'Milliseconds the value must stay unchanged before the debounced copy updates. Each change restarts the timer.'
            },
        ],
        returns: [
            {
                name: 'debouncedValue',
                type: 'T',
                description: 'The last value that stayed unchanged for the full delay. Starts as the initial value.'
            },
        ],
    },
    usetoggle: {
        name: 'useToggle',
        description: 'Hold a boolean with stable helpers to flip it, set it and reset it. Use it for modals, menus and on or off settings.',
        category: 'State',
        level: 'basic',
        popular: true,
        since: '1.0.0',
        signature: 'useToggle(initialValue?: boolean): ToggleResult',
        usage: `import {useToggle} from '@zenuilabs/react-hooks';

export default function App() {
  const {value: isOpen, toggle, setFalse: close, reset} = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>{isOpen ? 'Hide details' : 'Show details'}</button>
      <button onClick={reset}>Reset</button>
      {isOpen && (
        <div role="dialog">
          <p>Your order ships in two business days.</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}`,
        api: [
            {param: 'initialValue', type: 'boolean', description: 'Starting value. Defaults to false.'},
        ],
        returns: [
            {name: 'value', type: 'boolean', description: 'The current value.'},
            {name: 'toggle', type: '() => void', description: 'Flips the value.'},
            {name: 'setTrue', type: '() => void', description: 'Sets the value to true.'},
            {name: 'setFalse', type: '() => void', description: 'Sets the value to false.'},
            {name: 'set', type: '(value: boolean) => void', description: 'Sets the value directly.'},
            {name: 'reset', type: '() => void', description: 'Restores the latest initialValue.'},
        ],
    },
    usecounter: {
        name: 'useCounter',
        description: 'Hold a number with stable increment, decrement, set and reset helpers. Optional min, max and step options keep it inside a range, which suits quantity pickers and pagers.',
        category: 'State',
        level: 'basic',
        popular: true,
        since: '1.0.0',
        signature: 'useCounter(initialValue?: number, options?: CounterOptions): CounterActions',
        usage: `import {useCounter} from '@zenuilabs/react-hooks';

export default function App() {
  const {count, increment, decrement, reset} = useCounter(1, {min: 1, max: 10});

  return (
    <div>
      <p>Tickets: {count}</p>
      <button onClick={decrement} disabled={count === 1}>
        Remove one
      </button>
      <button onClick={increment} disabled={count === 10}>
        Add one
      </button>
      <button onClick={reset}>Reset</button>
      <p>Total: {count * 25} USD</p>
    </div>
  );
}`,
        api: [
            {param: 'initialValue', type: 'number', description: 'Starting value, clamped to the range. Defaults to 0.'},
            {param: 'options.min', type: 'number', description: 'Lowest allowed value. No limit when omitted.'},
            {param: 'options.max', type: 'number', description: 'Highest allowed value. No limit when omitted.'},
            {param: 'options.step', type: 'number', description: 'Amount added by increment and removed by decrement. Defaults to 1.'},
        ],
        returns: [
            {name: 'count', type: 'number', description: 'The current value.'},
            {name: 'increment', type: '() => void', description: 'Adds step, stopping at max.'},
            {name: 'decrement', type: '() => void', description: 'Subtracts step, stopping at min.'},
            {name: 'reset', type: '() => void', description: 'Restores initialValue, clamped to the range.'},
            {name: 'set', type: '(value: number) => void', description: 'Sets a specific value, clamped to the range.'},
        ],
    },
    useprevious: {
        name: 'usePrevious',
        description: 'Return the value a variable had on the previous render. Use it to compare old and new props or state, for example to show whether a number went up or down.',
        category: 'State',
        level: 'basic',
        since: '1.0.0',
        signature: 'usePrevious<T>(value: T): T | undefined',
        usage: `import {useState} from 'react';
import {usePrevious} from '@zenuilabs/react-hooks';

export default function App() {
  const [price, setPrice] = useState(100);
  const previous = usePrevious(price);

  const trend = previous === undefined ? 'new' : price > previous ? 'up' : price < previous ? 'down' : 'flat';

  return (
    <div>
      <p>
        Price: {price} ({trend})
      </p>
      <p>Previous: {previous ?? 'none'}</p>
      <button onClick={() => setPrice((p) => p + 5)}>Raise</button>
      <button onClick={() => setPrice((p) => p - 5)}>Lower</button>
    </div>
  );
}`,
        api: [
            {param: 'value', type: 'T', description: 'The value to remember.'},
        ],
        returns: [
            {
                name: 'previous',
                type: 'T | undefined',
                description: 'The value from the previous render. undefined on the first render. After a re-render where the value did not change, it equals the current value.'
            },
        ],
    },
    useupdate: {
        name: 'useUpdate',
        description: 'Return a stable function that re-renders the component. Use it when the data you show lives outside React state, such as a ref or a mutable object.',
        category: 'State',
        level: 'basic',
        since: '1.0.0',
        signature: 'useUpdate(): () => void',
        usage: `import {useRef} from 'react';
import {useUpdate} from '@zenuilabs/react-hooks';

export default function App() {
  const update = useUpdate();
  const cart = useRef<string[]>([]);

  const add = (item: string) => {
    cart.current.push(item);
    update();
  };

  return (
    <div>
      <button onClick={() => add('Coffee')}>Add coffee</button>
      <button onClick={() => add('Tea')}>Add tea</button>
      <p>{cart.current.length} items: {cart.current.join(', ')}</p>
    </div>
  );
}`,
        api: [],
        returns: [
            {
                name: 'update',
                type: '() => void',
                description: 'Stable function that schedules a re-render of the component.'
            },
        ],
    },
    usethrottle: {
        name: 'useThrottle',
        description: 'Return a copy of a fast-changing value that updates at most once per interval. Use it for scroll positions, pointer coordinates and other values that change many times a second.',
        category: 'Performance',
        level: 'intermediate',
        popular: true,
        since: '1.0.0',
        signature: 'useThrottle<T>(value: T, delay?: number): T',
        usage: `import {useEffect, useState} from 'react';
import {useThrottle} from '@zenuilabs/react-hooks';

export default function App() {
  const [position, setPosition] = useState({x: 0, y: 0});
  const throttled = useThrottle(position, 200);

  useEffect(() => {
    const onMove = (event: PointerEvent) => setPosition({x: event.clientX, y: event.clientY});
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    // Runs at most five times a second while the pointer moves.
    console.log('Send to analytics', throttled);
  }, [throttled]);

  return (
    <p>
      Live: {position.x}, {position.y}. Throttled: {throttled.x}, {throttled.y}
    </p>
  );
}`,
        api: [
            {param: 'value', type: 'T', description: 'The value to throttle.'},
            {
                param: 'delay',
                type: 'number',
                description: 'Minimum milliseconds between updates. Defaults to 300. The first change after a quiet period applies at once, and the latest value always applies at the end of the interval.'
            },
        ],
        returns: [
            {name: 'throttledValue', type: 'T', description: 'The throttled copy of value.'},
        ],
    },
    usefetch: {
        name: 'useFetch',
        description: 'Fetch JSON from a URL and track data, loading and error. It aborts stale requests when the URL changes or the component unmounts, and can refetch on demand.',
        category: 'Async & Data',
        level: 'intermediate',
        popular: true,
        since: '1.0.0',
        signature: 'useFetch<T>(url: string | null | undefined, options?: RequestInit): FetchResult<T>',
        usage: `import {useState} from 'react';
import {useFetch} from '@zenuilabs/react-hooks';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function App() {
  const [id, setId] = useState(1);
  const {data, loading, error, refetch} = useFetch<Post>(\`https://jsonplaceholder.typicode.com/posts/\${id}\`);

  return (
    <article>
      <button onClick={() => setId((n) => Math.max(1, n - 1))}>Previous</button>
      <button onClick={() => setId((n) => n + 1)}>Next</button>
      <button onClick={refetch}>Reload</button>
      {loading && <p>Loading post {id}</p>}
      {error && <p role="alert">{error}</p>}
      {data && (
        <>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
        </>
      )}
    </article>
  );
}`,
        api: [
            {
                param: 'url',
                type: 'string | null | undefined',
                description: 'The URL to request. A new URL starts a new request and aborts the previous one. An empty value skips the request.'
            },
            {
                param: 'options',
                type: 'RequestInit',
                description: 'Options passed to fetch. They are compared by their JSON form, so an inline object does not trigger a new request on every render. A signal you pass also aborts the request.'
            },
        ],
        returns: [
            {name: 'data', type: 'T | null', description: 'The parsed JSON of the last successful response. Kept while a new request loads.'},
            {name: 'loading', type: 'boolean', description: 'True while a request is in flight. Starts as true when a URL is given.'},
            {
                name: 'error',
                type: 'string | null',
                description: 'The error message of the last failed request, for example "Request failed with status 404". Aborted requests never set it.'
            },
            {name: 'refetch', type: '() => void', description: 'Stable function that runs the request again.'},
        ],
    },
    useasync: {
        name: 'useAsync',
        description: 'Run an async function and track its loading, error and data. Only the most recent call updates state, so a slow earlier call never overwrites a newer result.',
        category: 'Async & Data',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useAsync<T, Args extends unknown[]>(asyncFunction: (...args: Args) => Promise<T>, immediate?: boolean, deps?: DependencyList): AsyncState<T> & AsyncControls<T, Args>',
        usage: `import {useAsync} from '@zenuilabs/react-hooks';

interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number): Promise<User> {
  const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
  if (!res.ok) throw new Error(\`Could not load user \${id}\`);
  return res.json();
}

export default function App() {
  const {data, loading, error, execute, reset} = useAsync(getUser, false);

  return (
    <div>
      {[1, 2, 3].map((id) => (
        <button key={id} onClick={() => execute(id)}>
          Load user {id}
        </button>
      ))}
      <button onClick={reset}>Clear</button>
      {loading && <p>Loading</p>}
      {error && <p role="alert">{error.message}</p>}
      {data && <p>{data.name} ({data.email})</p>}
    </div>
  );
}`,
        api: [
            {
                param: 'asyncFunction',
                type: '(...args: Args) => Promise<T>',
                description: 'The function to run. The latest version is always called, so it does not need to be memoized.'
            },
            {
                param: 'immediate',
                type: 'boolean',
                description: 'Run once on mount, with no arguments. Defaults to true.'
            },
            {
                param: 'deps',
                type: 'DependencyList',
                description: 'With immediate set, run again whenever these values change. Defaults to [].'
            },
        ],
        returns: [
            {name: 'data', type: 'T | null', description: 'The result of the latest successful call. Reset to null when a call starts.'},
            {name: 'error', type: 'any', description: 'Whatever the latest call threw, or null.'},
            {name: 'loading', type: 'boolean', description: 'True while the latest call is running.'},
            {
                name: 'execute',
                type: '(...args: Args) => Promise<T | null>',
                description: 'Stable function that runs asyncFunction with the given arguments. Resolves to the result, or null when it throws.'
            },
            {
                name: 'reset',
                type: '() => void',
                description: 'Clears data and error, and ignores any call that is still running.'
            },
        ],
    },
    usehover: {
        name: 'useHover',
        description: 'Track whether the pointer is over an element. Use it for previews, tooltips and hover styles that need JavaScript.',
        category: 'Events & DOM',
        level: 'basic',
        since: '1.0.0',
        signature: 'useHover<T extends HTMLElement = HTMLElement>(): HoverResult<T>',
        usage: `import {useHover} from '@zenuilabs/react-hooks';

export default function App() {
  const {ref, isHovered} = useHover<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{padding: 24, border: '1px solid #ccc', background: isHovered ? '#f5f5f5' : 'white'}}
    >
      <h3>Weekend in Lisbon</h3>
      {isHovered ? (
        <p>3 nights, flights included, from 420 EUR.</p>
      ) : (
        <p>Hover to see the details.</p>
      )}
    </div>
  );
}`,
        api: [],
        returns: [
            {
                name: 'ref',
                type: 'HoverRef<T>',
                description: 'Callback ref to pass as ref={ref}. It follows the element when it mounts later or changes, and exposes the element as ref.current.'
            },
            {name: 'isHovered', type: 'boolean', description: 'True while the pointer is over the element. Resets to false when the element unmounts.'},
        ],
    },
    useclickoutside: {
        name: 'useClickOutside',
        description: 'Call a function when the user presses anywhere outside an element. Use it to close menus, popovers and dialogs.',
        category: 'Events & DOM',
        level: 'basic',
        popular: true,
        since: '1.0.0',
        signature: 'useClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null>, handler: (event: MouseEvent | TouchEvent) => void): void',
        usage: `import {useRef, useState} from 'react';
import {useClickOutside} from '@zenuilabs/react-hooks';

export default function App() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setOpen(false));

  return (
    <div ref={menuRef}>
      <button onClick={() => setOpen((o) => !o)}>Account</button>
      {open && (
        <ul>
          <li>Profile</li>
          <li>Settings</li>
          <li>Sign out</li>
        </ul>
      )}
    </div>
  );
}`,
        api: [
            {param: 'ref', type: 'RefObject<T | null>', description: 'Ref to the element. Presses inside it, including on its children, are ignored.'},
            {
                param: 'handler',
                type: '(event: MouseEvent | TouchEvent) => void',
                description: 'Called on a press outside the element. Uses pointerdown when supported, otherwise mousedown and touchstart without firing twice for one tap. An inline function is fine and does not re-subscribe.'
            },
        ],
        returns: [],
    },
    usewindowsize: {
        name: 'useWindowSize',
        description: 'Track the inner width and height of the browser window. Use it for layout decisions that CSS media queries cannot express.',
        category: 'Events & DOM',
        level: 'basic',
        popular: true,
        since: '1.0.0',
        signature: 'useWindowSize(): WindowSize',
        usage: `import {useWindowSize} from '@zenuilabs/react-hooks';

export default function App() {
  const {width, height} = useWindowSize();

  if (width === 0) return null; // Not measured yet (server or first render).

  const columns = width < 640 ? 1 : width < 1024 ? 2 : 4;

  return (
    <div>
      <p>
        Window: {width} x {height}. Showing {columns} column{columns > 1 ? 's' : ''}.
      </p>
      <div style={{display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: 8}}>
        {Array.from({length: 8}, (_, i) => (
          <div key={i} style={{border: '1px solid #ccc', padding: 16}}>Card {i + 1}</div>
        ))}
      </div>
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'width', type: 'number', description: 'window.innerWidth in pixels. 0 on the server and on the first client render, then measured before the browser paints.'},
            {name: 'height', type: 'number', description: 'window.innerHeight in pixels. 0 until measured, like width.'},
        ],
    },
    usekeypress: {
        name: 'useKeyPress',
        description: 'Return true while a specific key is held down. Use it for keyboard shortcuts, game controls and modifier keys such as Shift.',
        category: 'Events & DOM',
        level: 'basic',
        since: '1.0.0',
        signature: 'useKeyPress(targetKey: string): boolean',
        usage: `import {useState} from 'react';
import {useKeyPress} from '@zenuilabs/react-hooks';

const FILES = ['report.pdf', 'budget.xlsx', 'photo.jpg', 'notes.txt'];

export default function App() {
  const shiftHeld = useKeyPress('Shift');
  const [selected, setSelected] = useState<string[]>([]);

  const select = (file: string) => {
    // Shift adds to the selection, a plain click replaces it.
    setSelected((prev) => (shiftHeld ? [...new Set([...prev, file])] : [file]));
  };

  return (
    <div>
      <p>{shiftHeld ? 'Multi-select is on' : 'Hold Shift to select several files'}</p>
      <ul>
        {FILES.map((file) => (
          <li key={file} onClick={() => select(file)} style={{fontWeight: selected.includes(file) ? 'bold' : 'normal'}}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        api: [
            {
                param: 'targetKey',
                type: 'string',
                description: 'The KeyboardEvent.key value to watch, for example "Enter", "Shift", "ArrowUp" or "a". The match is case-sensitive.'
            },
        ],
        returns: [
            {
                name: 'pressed',
                type: 'boolean',
                description: 'True between keydown and keyup of the key. Resets to false when the window loses focus.'
            },
        ],
    },
    uselongpress: {
        name: 'useLongPress',
        description: 'Call a function when an element is pressed and held for a set time, with mouse or touch. Use it for context actions and hold-to-confirm buttons.',
        category: 'Interaction',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useLongPress(callback: () => void, options?: LongPressOptions): LongPressHandlers',
        usage: `import {useState} from 'react';
import {useLongPress} from '@zenuilabs/react-hooks';

export default function App() {
  const [status, setStatus] = useState('Hold the button for one second to delete the message.');

  const bind = useLongPress(() => setStatus('Message deleted.'), {
    delay: 1000,
    onStart: () => setStatus('Keep holding'),
    onEnd: () => console.log('Released after a long press'),
  });

  // onEnd only runs after a completed long press, so catch early releases separately.
  const onPointerUp = () => setStatus((s) => (s === 'Keep holding' ? 'Released too early.' : s));

  return (
    <div>
      <button {...bind} onPointerUp={onPointerUp}>
        Hold to delete
      </button>
      <p>{status}</p>
    </div>
  );
}`,
        api: [
            {param: 'callback', type: '() => void', description: 'Called once the press has been held for the full delay.'},
            {param: 'options.delay', type: 'number', description: 'Milliseconds to hold before the callback runs. Defaults to 500.'},
            {param: 'options.onStart', type: '() => void', description: 'Called when a press starts.'},
            {param: 'options.onEnd', type: '() => void', description: 'Called when the press ends after the callback has fired. Not called for a short press.'},
        ],
        returns: [
            {
                name: 'bind',
                type: 'LongPressHandlers',
                description: 'Stable object with onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, onTouchCancel and onContextMenu. Spread it onto the element. Only the left mouse button starts a press, and the context menu is suppressed during a touch press.'
            },
        ],
    },
    usescroll: {
        name: 'useScroll',
        description: 'Track the scroll position and the direction of the last scroll, for the window or a scrollable element. Use it for reading progress bars and headers that hide on scroll.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useScroll<T extends HTMLElement = HTMLElement>(ref?: RefObject<T | null>): ScrollData',
        usage: `import {useScroll} from '@zenuilabs/react-hooks';

export default function App() {
  const {y, direction} = useScroll();
  const hideHeader = direction === 'down' && y > 80;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: 16,
          background: 'white',
          transform: hideHeader ? 'translateY(-100%)' : 'none',
          transition: 'transform 200ms',
        }}
      >
        Scrolled {Math.round(y)}px
      </header>
      <main style={{height: 3000, paddingTop: 80}}>Scroll down to hide the header, up to show it.</main>
    </>
  );
}`,
        api: [
            {
                param: 'ref',
                type: 'RefObject<T | null>',
                description: 'Ref to a scrollable element. Omit it to track the window. The ref is re-read after each render, so an element that mounts later is picked up.'
            },
        ],
        returns: [
            {name: 'x', type: 'number', description: 'Horizontal scroll offset in pixels. 0 on the server, then read after mount.'},
            {name: 'y', type: 'number', description: 'Vertical scroll offset in pixels. 0 on the server, then read after mount.'},
            {
                name: 'direction',
                type: "'up' | 'down' | 'left' | 'right' | null",
                description: 'Direction of the last scroll event. Vertical movement wins when both axes change. null before the first scroll.'
            },
        ],
    },
    usedrop: {
        name: 'useDrop',
        description: 'Turn an element into a drop target for files, text or links. Use it when you want to accept any kind of dragged content.',
        category: 'Interaction',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useDrop<T extends HTMLElement = HTMLElement>(): DropResult<T>',
        usage: `import {useDrop} from '@zenuilabs/react-hooks';

export default function App() {
  const {isOver, data, handlers} = useDrop<HTMLDivElement>();

  let dropped = 'Nothing yet';
  if (typeof data === 'string') dropped = data;
  if (data instanceof FileList) dropped = Array.from(data).map((file) => file.name).join(', ');

  return (
    <div>
      <p draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', 'Quarterly report')}>
        Drag me
      </p>
      <div
        {...handlers}
        style={{padding: 40, border: '2px dashed', borderColor: isOver ? 'royalblue' : '#ccc'}}
      >
        {isOver ? 'Release to drop' : 'Drop text, a link or files here'}
      </div>
      <p>Dropped: {dropped}</p>
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'ref', type: 'RefObject<T | null>', description: 'Optional ref for the drop target, if you need to reach the element.'},
            {
                name: 'isOver',
                type: 'boolean',
                description: 'True while something is dragged over the element. Moving over child elements does not reset it.'
            },
            {
                name: 'data',
                type: 'FileList | string | null',
                description: 'What was dropped last: a FileList for files, otherwise the plain text or URL. null before the first drop.'
            },
            {
                name: 'handlers',
                type: 'DropHandlers',
                description: 'Stable onDragEnter, onDragOver, onDragLeave and onDrop handlers. Spread all of them onto the element.'
            },
        ],
    },
    usedroparea: {
        name: 'useDropArea',
        description: 'Turn an element into a drop zone for files, with optional type filtering. Use it for upload areas.',
        category: 'Interaction',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useDropArea<T extends HTMLElement = HTMLElement>(options?: DropAreaOptions): DropAreaResult<T>',
        usage: `import {useDropArea} from '@zenuilabs/react-hooks';

export default function App() {
  const {isOver, files, rejected, handlers, clear} = useDropArea<HTMLDivElement>({
    accept: ['image/*', '.pdf'],
  });

  return (
    <div>
      <div
        {...handlers}
        style={{padding: 40, border: '2px dashed', borderColor: isOver ? 'royalblue' : '#ccc'}}
      >
        {isOver ? 'Release to add the files' : 'Drop images or PDFs here'}
      </div>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name} ({Math.round(file.size / 1024)} KB)
          </li>
        ))}
      </ul>
      {rejected.length > 0 && <p>Skipped {rejected.length} file(s) of the wrong type.</p>}
      <button onClick={clear}>Clear</button>
    </div>
  );
}`,
        api: [
            {
                param: 'options.accept',
                type: 'string[]',
                description: 'Allowed file types as MIME types ("image/png"), wildcards ("image/*") or extensions (".pdf"). Accepts every file when omitted.'
            },
            {
                param: 'options.multiple',
                type: 'boolean',
                description: 'Keep every accepted file. When false only the first accepted file is kept. Defaults to true.'
            },
        ],
        returns: [
            {name: 'ref', type: 'RefObject<T | null>', description: 'Optional ref for the drop zone, if you need to reach the element.'},
            {name: 'isOver', type: 'boolean', description: 'True while files are dragged over the zone. Moving over child elements does not reset it.'},
            {name: 'files', type: 'File[]', description: 'Accepted files from the last drop. Each drop replaces the list.'},
            {name: 'rejected', type: 'File[]', description: 'Files from the last drop that did not match accept.'},
            {
                name: 'handlers',
                type: 'DropAreaHandlers',
                description: 'Stable onDragEnter, onDragOver, onDragLeave and onDrop handlers. Spread all of them onto the element.'
            },
            {name: 'clear', type: '() => void', description: 'Empties files and rejected.'},
        ],
    },
    useevent: {
        name: 'useEvent',
        description: 'Attach an event listener to the window, the document, an element or a ref, and remove it on unmount. The listener can change on every render without re-subscribing.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useEvent(type: string, listener: (event: Event) => void, target?: EventTarget | RefObject<EventTarget | null> | null, options?: EventOptions): void',
        usage: `import {useRef, useState} from 'react';
import {useEvent} from '@zenuilabs/react-hooks';

export default function App() {
  const [width, setWidth] = useState(0);
  const [lastKey, setLastKey] = useState('');
  const [clicks, setClicks] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Window is the default target.
  useEvent('resize', () => setWidth(window.innerWidth));

  // The event is typed as a KeyboardEvent.
  useEvent('keydown', (event) => setLastKey(event.key), document);

  // Refs work too, including elements that mount later.
  useEvent('click', () => setClicks((n) => n + 1), buttonRef);

  return (
    <div>
      <p>Window width: {width || 'resize to measure'}</p>
      <p>Last key: {lastKey || 'none'}</p>
      <button ref={buttonRef}>Clicked {clicks} times</button>
    </div>
  );
}`,
        api: [
            {param: 'type', type: 'string', description: 'The event name, for example "resize", "keydown" or "pointermove". Custom event names work too.'},
            {
                param: 'listener',
                type: '(event) => void',
                description: 'Called with the event. Its type comes from the target: WindowEventMap for the window, DocumentEventMap for the document and HTMLElementEventMap for elements. The latest function is always called.'
            },
            {
                param: 'target',
                type: 'Window | Document | HTMLElement | RefObject | null',
                description: 'Where to listen. Defaults to window. Pass null to pause. A ref is re-read after every render, so the listener moves when the element changes.'
            },
            {
                param: 'options',
                type: 'EventOptions',
                description: 'capture, passive and once. Compared by value, so an inline object does not re-subscribe.'
            },
        ],
        returns: [],
    },
};
