export const hooksData: Record<string, any> = {
    uselocalstorage: {
        name: 'useLocalStorage',
        description: 'Persist state in localStorage with automatic JSON serialization and synchronization',
        category: 'State Management',
        usage: `import { useLocalStorage } from '@zenuilabs/react-hooks';

function MyComponent() {
  const {storedValue, setValue} = useLocalStorage('key', 'initialValue');
  
  return (
    <div>
      <input 
        value={storedValue} 
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Stored name: {storedValue}</p>
    </div>
  );
}`,
        api: [
            {param: 'key', type: 'string', description: 'The localStorage key to use'},
            {param: 'initialValue', type: 'T', description: 'Initial value if key doesn\'t exist'}
        ],
        returns: [
            {name: 'storedValue', type: 'T', description: 'Current stored value'},
            {
                name: 'setValue',
                type: '(value: T | ((val: T) => T)) => void',
                description: 'Function to update the stored value'
            }
        ]
    },
    usesessionstorage: {
        name: 'useSessionStorage',
        description: 'Persist state in localStorage with automatic JSON serialization and synchronization',
        category: 'State Management',
        usage: `import React, {useEffect} from "react";
import {useSessionStorage} from "@zenuilabs/react-hooks";

const UseSessionStorageExample = () => {
    const {value, setValue, remove} = useSessionStorage<number>("session-visits", 0);

    useEffect(() => {
        setValue(value + 1);
    }, []);

    return (
        <div
            className="rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <h2 className="text-lg font-semibold mb-2">Session Visit Counter</h2>
            <p className="dark:text-darkText/70 mb-7">
                You have visited this page <strong
                className='dark:text-darkText'>{value}</strong> {value === 1 ? "time" : "times"} this session.
            </p>
            <button
                onClick={() => setValue(0)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
                Reset Counter
            </button>
            <p className="mt-4 text-sm text-gray-400">Counter resets when the browser tab is closed.</p>
        </div>
    );
};

export default UseSessionStorageExample;`,
        api: [
            {
                param: 'key',
                type: 'string',
                description: 'The key under which the value will be stored in sessionStorage.'
            },
            {
                param: 'initialValue',
                type: 'T',
                description: 'The initial value to use if the key does not exist in sessionStorage.'
            }
        ],
        returns: [
            {name: 'value', type: 'T', description: 'The current value stored in sessionStorage for the given key.'},
            {
                name: 'setValue',
                type: 'react.Dispatch<react.SetStateAction<T>>',
                description: 'Function to update the stored value. Can take a direct value or an updater function that receives the previous value.'
            }
        ]
    },
    usedebounce: {
        name: 'useDebounce',
        description: 'Delay updating a value until a specified time has passed since the last change. Useful for optimizing performance in search inputs, filters, or resize events.',
        category: 'Performance & Effects',
        usage: `import React, { useState, useEffect } from "react";
import { useDebounce } from "@zenuilabs/react-hooks";

const UseDebounceExample = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 600); // Wait 600ms after typing stops

    useEffect(() => {
        if (debouncedQuery) {
            console.log("Fetching results for:", debouncedQuery);
            // Example API simulation
            const fetchData = async () => {
                // Imagine calling an API here
                console.log(\`API called\`);
            };
            fetchData();
        }
    }, [debouncedQuery]);

    return (
        <div className="rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <h2 className="text-lg font-semibold mb-3">Debounced Search Example</h2>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandColor"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
                Value updates only after <strong>600ms</strong> of inactivity.
            </p>

            <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Live Input:</span> {query || "—"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-semibold">Debounced Value:</span> {debouncedQuery || "—"}
                </p>
            </div>
        </div>
    );
};

export default UseDebounceExample;`,
        api: [
            {
                param: 'value',
                type: 'T',
                description: 'The value to debounce (e.g., user input or changing state).'
            },
            {
                param: 'delay',
                type: 'number',
                description: 'The debounce delay in milliseconds before updating the returned value.'
            }
        ],
        returns: [
            {
                name: 'debouncedValue',
                type: 'T',
                description: 'The debounced version of the input value, updated only after the specified delay.'
            }
        ]
    },
    usetoggle: {
        name: 'useToggle',
        description: 'Manage boolean state with convenient helper functions for common operations',
        category: 'State Management',
        usage: `
import {useToggle} from "@zenuilabs/react-hooks";
import {Moon, Sun} from "lucide-react"; // icons are optional, we used lucide icons

const UseToggleExample = () => {
    const {value, toggle, setTrue, setFalse} = useToggle(false);

    return (
        <div className="p-8 rounded-xl bg-gray-50 dark:bg-gray-900">
            <div
                className={\`flex items-center w-max gap-2 mb-5 px-4 py-2 rounded-lg text-white transition-colors bg-gray-800\`}
            >
                {value ? <Moon size={18}/> : <Sun size={18}/>}
                <span>{value ? "Dark Mode" : "Light Mode"}</span>
            </div>

            <button
                onClick={toggle}
                className="px-4 py-2 bg-brandColor active:scale-[0.95] transition-transform duration-100 hover:bg-brandColor/80 cursor-pointer text-white rounded-lg text-sm font-medium"
            >
                Toggle
            </button>

            <button
                onClick={setTrue}
                disabled={value}
                className="px-4 disabled:cursor-not-allowed disabled:bg-gray-100 ml-3 py-2 border border-gray-200 cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:disabled:bg-gray-800 dark:text-darkText rounded-lg text-sm font-medium"
            >
                Set true
            </button>

            <button
                onClick={setFalse}
                disabled={!value}
                className="px-4 ml-3 disabled:cursor-not-allowed disabled:bg-gray-100 py-2 border border-gray-200 cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:disabled:bg-gray-800 dark:text-darkText rounded-lg text-sm font-medium"
            >
                Set false
            </button>
        </div>
    );
};

export default UseToggleExample;`,
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
        usage: `
import {useCounter} from "@zenuilabs/react-hooks";
import {Minus, Plus} from "lucide-react"; // icons are optional, we used lucide icons

const UseCounterExample = () => {
    const {count, increment, decrement, reset, set} = useCounter(0);

    return (
        <div
            className="rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <p className="text-lg">
                Current Count: <strong>{count}</strong>
            </p>

            <div className="flex gap-2 mt-10">
                <button
                    onClick={increment}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    <Plus/>
                </button>
                <button
                    onClick={decrement}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    <Minus/>
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded hover:bg-gray-500 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={() => set(10)}
                    className="px-4 py-2 bg-brandColor cursor-pointer text-white rounded hover:bg-brandColor/80 transition-colors"
                >
                    Set to 10
                </button>
            </div>
        </div>
    );
};

export default UseCounterExample;`,
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
    useprevious: {
        name: 'usePrevious',
        description: 'Counter state with increment, decrement, reset, and set operations',
        category: 'State Management',
        usage: `
import {useCounter, usePrevious} from "@zenuilabs/react-hooks";

const UsePreviousExample = () => {
    const {count, increment, decrement, reset} = useCounter(0)
    
    const prevCount = usePrevious(count); // the hook

    return (
        <div
            className="rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <p>
                Current Count: <strong>{count}</strong>
            </p>
            <p className='mt-1'>
                Previous Count: <strong>{prevCount ?? 0}</strong>
            </p>

            <div className="flex gap-2 mt-8">
                <button
                    onClick={increment}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Increment
                </button>
                <button
                    onClick={decrement}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Decrement
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded hover:bg-gray-500 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default UsePreviousExample;`,
        api: [
            {
                param: 'value',
                type: 'T',
                description: 'The current value whose previous state you want to track.'
            }
        ],
        returns: []
    },
    useupdate: {
        name: 'useUpdate',
        description: 'Counter state with increment, decrement, reset, and set operations',
        category: 'State Management',
        usage: `import React, {useState} from "react";
import {useUpdate} from "@zenuilabs/react-hooks";

const UseUpdateExample = () => {
    const [count, setCount] = useState(0);
    const triggerUpdate = useUpdate();

    console.log("Component rendered");

    return (
        <div
            className="rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <p>
                Counter: <strong>{count}</strong>
            </p>

            <div className="flex gap-3 mt-8">
                <button
                    onClick={() => setCount(prev => prev + 1)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Increment Count
                </button>
                <button
                    onClick={triggerUpdate}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                >
                    Force Re-render
                </button>
            </div>
        </div>
    );
};

export default UseUpdateExample;`,
        api: [],
        returns: []
    },
    usethrottle: {
        name: 'useThrottle',
        description: 'Limit how frequently a value updates by enforcing a fixed time interval. Useful for optimizing performance in scroll, resize, or rapid input events.',
        category: 'Performance & Effects',
        usage: `import React, { useState, useEffect } from "react";
import { useThrottle } from "@zenuilabs/react-hooks";

const UseThrottleExample = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const throttledPosition = useThrottle(position, 300); // Update at most every 300ms

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div className="h-[50vh] flex flex-col justify-center pl-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <h2 className="text-lg font-semibold mb-4">Throttled Mouse Tracker</h2>

            <div className="bg-gray-100 w-max dark:bg-gray-800 p-6 rounded-xl shadow-inner">
                <p className="text-sm mb-2">
                    <strong>Live Position:</strong> X: {position.x}, Y: {position.y}
                </p>
                <p className="text-sm">
                    <strong>Throttled Position:</strong> X: {throttledPosition.x}, Y: {throttledPosition.y}
                </p>
            </div>

            <p className="mt-6 text-sm text-gray-400">
                Throttled updates occur every <strong>300ms</strong> for smoother performance.
            </p>
        </div>
    );
};

export default UseThrottleExample;`,
        api: [
            {
                param: 'value',
                type: 'T',
                description: 'The changing value you want to throttle (e.g., scroll position, mouse move, or input).'
            },
            {
                param: 'delay',
                type: 'number',
                description: 'The minimum time in milliseconds to wait before allowing the next value update.'
            }
        ],
        returns: [
            {
                name: 'throttledValue',
                type: 'T',
                description: 'The throttled version of the input value that updates only once every specified time interval.'
            }
        ]
    },
    usefetch: {
        name: 'useFetch',
        description: 'A powerful data-fetching hook that manages loading, error, and response states automatically.',
        category: 'Data Fetching',
        usage: `import React from "react";
import { useFetch } from "@zenuilabs/react-hooks";

const UseFetchExample = () => {
    const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts");

    if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-8 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <h2 className="text-lg font-semibold mb-3">Fetched Posts</h2>
            <ul className="space-y-3 mb-5">
                {data?.slice(0, 5).map((post: any) => (
                    <li key={post.id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                        <h3 className="font-semibold mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UseFetchExample;`,
        api: [
            {
                param: 'url',
                type: 'string',
                description: 'The API endpoint or resource URL to fetch data from.'
            },
            {
                param: 'options?',
                type: 'RequestInit',
                description: 'Optional fetch configuration such as headers, method, or body.'
            },
        ],
        returns: [
            {name: 'data', type: 'T | null', description: 'The fetched response data (JSON parsed).'},
            {
                name: 'loading',
                type: 'boolean',
                description: 'Indicates whether the fetch request is currently in progress.'
            },
            {name: 'error', type: 'Error | null', description: 'Error object if the fetch fails, otherwise null.'},
        ]
    },
    useasync: {
        name: 'useAsync',
        description: 'Manage the lifecycle of asynchronous operations (loading, success, error) with built-in state management. Ideal for handling promises, API calls, or any async task.',
        category: 'Async Utilities',
        usage: `import React, { useEffect } from "react";
import { useAsync } from "@zenuilabs/react-hooks";

const UseAsyncExample = () => {
    const fetchUser = useCallback(async (userId = 1) => {
        const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}/\`);
        const json = await res.json();
        return json;
    }, []);

    const hookResult = useAsync(fetchUser, false);
    const {data, loading, error, execute, reset} = hookResult;

    useEffect(() => {
        execute(1)
    }, [])

    return (
        <div className="rounded-xl p-8 bg-gray-50 text-gray-900 dark:bg-gray-900 dark transition-colors">
            <h2 className="text-2xl font-bold mb-6 dark:text-darkText">Async User Fetcher</h2>

            {loading && (
                <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                    <p className="text-blue-300">🔄 Fetching user data...</p>
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300">❌ {error.message}</p>
                </div>
            )}

            {data && (
                <div className="mb-6 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">✅ User Data</h3>
                    <div className="space-y-2 dark:text-darkText/80">
                        <p><strong>Name:</strong> {data.name}</p>
                        <p><strong>Email:</strong> {data.email}</p>
                        <p><strong>Username:</strong> {data.username}</p>
                        <p><strong>Company:</strong> {data.company?.name}</p>
                        <p><strong>City:</strong> {data.address?.city}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((id) => (
                    <button
                        key={id}
                        onClick={() => execute(id)}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-black/60 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                    >
                        Load User {id}
                    </button>
                ))}
                <button
                    onClick={reset}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-gray-600  font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default UseAsyncExample;`,
        api: [
            {
                param: 'asyncFunction',
                type: '() => Promise<T>',
                description: 'The asynchronous function that returns a promise.'
            },
            {
                param: 'immediate?',
                type: 'boolean',
                description: 'If true, the async function is executed immediately on mount. Defaults to false.'
            }
        ],
        returns: [
            {name: 'data', type: 'T | null', description: 'Resolved value from the async function.'},
            {name: 'error', type: 'Error | null', description: 'Error object if the async operation fails.'},
            {name: 'loading', type: 'boolean', description: 'Indicates if the async operation is currently running.'},
            {
                name: 'execute',
                type: '() => Promise<void>',
                description: 'Function to manually trigger the async operation.'
            },
            {
                name: 'reset',
                type: '() => void',
                description: 'Function to reset the async operation.'
            }
        ]
    },
    usehover: {
        name: 'useHover',
        description: 'Detect whether an element is being hovered by the mouse and track its hover state.',
        category: 'UI & Interaction',
        usage: `import {useHover} from "@zenuilabs/react-hooks";

const UseHoverExample = () => {
    const {ref, isHovered} = useHover<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={\`rounded-xl p-8 transition-colors
                \${isHovered ? 'bg-brandColor text-white' : 'bg-gray-50 !text-gray-900'}
                dark:\${isHovered ? 'bg-brandColor text-white' : 'bg-gray-900 text-white'}
            \`}
        >
            <h2 className="text-xl font-semibold mb-4">
                {isHovered ? "You're hovering!" : "Hover over this card"}
            </h2>
            <p className="mb-4">
                {isHovered
                    ? "The card changes color and text when hovered."
                    : "Move your mouse over the card to see the hover effect."}
            </p>
            <button
                className={\`px-4 py-2 rounded-lg font-medium shadow-sm transition-colors
                    \${isHovered ? 'bg-white text-brandColor hover:bg-gray-100' : 'bg-brandColor text-white hover:bg-brandColor'}
                \`}
            >
                {isHovered ? "Hovered!" : "Hover me"}
            </button>
        </div>
    );
};

export default UseHoverExample;
`,
        api: [],
        returns: [
            {
                name: 'Ref',
                type: 'React.RefObject<T>',
                description: 'A ref object that can be attached to any DOM element.'
            },
            {
                name: 'isHovered',
                type: 'boolean',
                description: 'True if the element is currently being hovered, false otherwise.'
            }
        ]
    },
    useclickoutside: {
        name: 'useClickOutside',
        description: 'Detect clicks or touches outside a referenced element and trigger a handler function. Useful for closing dropdowns, modals, or tooltips when clicking outside.',
        category: 'UI & Interaction',
        usage: `import React, {useRef, useState} from "react";
import {useClickOutside} from "@zenuilabs/react-hooks";

const ClickOutsideDropdown = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Close the dropdown when clicking outside
    useClickOutside(ref, () => setIsOpen(false));

    return (
        <div className="flex flex-col rounded-xl justify-center p-16 bg-gray-100 dark:bg-gray-900">
            <div
                className="relative w-max text-gray-900 dark:text-white">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-md bg-brandColor text-white hover:bg-brandColor/90 transition-colors"
                >
                    {isOpen ? "Close Dropdown" : "Open Dropdown"}
                </button>

                {isOpen && (
                    <div
                        ref={ref}
                        className="absolute top-full mt-2 w-64 p-4 rounded-md shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <p>This dropdown closes when you click outside of it.</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Try clicking anywhere else on the page.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClickOutsideDropdown;`,
        api: [
            {
                param: 'ref',
                type: 'React.RefObject<T>',
                description: 'A ref to the element you want to detect outside clicks for.'
            },
            {
                param: 'handler',
                type: '(event: MouseEvent | TouchEvent) => void',
                description: 'A callback function that will be called when a click occurs outside the referenced element.'
            }
        ],
        returns: []
    },
    usewindowsize: {
        name: 'useWindowSize',
        description: 'Track the current width and height of the browser window. Automatically updates when the window is resized.',
        category: 'UI & Utilities',
        usage: `import React from "react";
import {useWindowSize} from "@zenuilabs/react-hooks";

const WindowSizeCard = () => {
    const {width, height} = useWindowSize();

    return (
        <div className="flex justify-center p-16 rounded-xl flex-col dark:text-darkText bg-gray-100 dark:bg-gray-900">
            <p className="mb-2">
                <strong>Width:</strong> {width}px
            </p>
            <p>
                <strong>Height:</strong> {height}px
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
                Resize the window to see these values update in real-time.
            </p>
        </div>
    );
};

export default WindowSizeCard;`,
        api: [],
        returns: [
            {name: 'width', type: 'number', description: 'The current width of the window in pixels.'},
            {name: 'height', type: 'number', description: 'The current height of the window in pixels.'}
        ]
    },
    usekeypress: {
        name: 'useKeyPress',
        description: 'Track whether a specific key is currently being pressed on the keyboard.',
        category: 'UI & Interaction',
        usage: `import React from "react";
import {useKeyPress} from "@zenuilabs/react-hooks";

const KeyPressCard = () => {
    const isEnterPressed = useKeyPress("Enter");

    return (
        <div className="flex justify-center dark:text-darkText flex-col rounded-xl p-16 bg-gray-100 dark:bg-gray-900">
            <p>
                Press the <strong>Enter</strong> key to see the state update:
            </p>
            <p className="mt-2 text-lg font-medium">
                Status:{" "}
                <span className={isEnterPressed ? "text-green-500" : "text-red-500"}>
                        {isEnterPressed ? "Pressed" : "Released"}
                    </span>
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Works with any keyboard key. Just change the key passed to useKeyPress.
            </p>
        </div>
    );
};

export default KeyPressCard;`,
        api: [
            {
                param: 'targetKey',
                type: 'string',
                description: 'The key to track, e.g., "Enter", "Escape", "ArrowUp", etc.'
            }
        ],
        returns: [
            {
                name: 'pressed',
                type: 'boolean',
                description: 'True if the target key is currently pressed, false otherwise.'
            }
        ]
    },
    uselongpress: {
        name: 'useLongPress',
        description: 'Detect long press gestures on mouse or touch devices and trigger a callback after a specified delay.',
        category: 'UI & Interaction',
        usage: `import React, {useState} from "react";
import {useLongPress} from "@zenuilabs/react-hooks";

const LongPressCard = () => {
    const [count, setCount] = useState(0);

    const onLongPress = () => {
        setCount(prev => prev + 1);
    };

    const bind = useLongPress(onLongPress, {
        delay: 1000,
        onStart: () => console.log("Press started"),
        onEnd: () => console.log("Press ended"),
    });

    return (
        <div className="flex p-16 rounded-xl bg-gray-100 dark:bg-gray-900">
            <div
                {...bind}
                className="rounded-xl p-8 shadow-lg h-max transition-colors cursor-pointer select-none
                    bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white text-center"
            >
                <p className="mb-4">Press and hold this card for 1 second to increase the counter.</p>
                <p className="text-lg font-medium">Count: {count}</p>
            </div>
        </div>
    );
};

export default LongPressCard;`,
        api: [
            {
                param: 'callback',
                type: '() => void',
                description: 'Function to execute when the long press is triggered.'
            },
            {
                param: 'options',
                type: '{ delay?: number; onStart?: () => void; onEnd?: () => void }',
                description: 'Optional configuration: delay in ms, onStart callback, and onEnd callback.'
            }
        ],
        returns: [
            {
                name: 'bind',
                type: 'object',
                description: 'Object containing event handlers to spread onto the target element.'
            }
        ]
    },
    usescroll: {
        name: 'useScroll',
        description: 'Track the scroll position (x, y) and scroll direction of an element or the window.',
        category: 'UI & Utilities',
        usage: `import React, {useRef} from "react";
import {useScroll} from "@zenuilabs/react-hooks";

const UseScrollExample = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {x, y, direction} = useScroll(containerRef);

    return (
        <div
            className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            <div
                className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md">
                <p>Scroll X: <strong>{x}px</strong></p>
                <p>Scroll Y: <strong>{y}px</strong></p>
                <p>Direction: <strong>{direction ?? "none"}</strong></p>
            </div>

            <div
                ref={containerRef}
                className="h-64 w-full max-w-md overflow-auto rounded-lg bg-gray-100 dark:bg-gray-800"
            >
                <div
                    className="h-[1200px] w-full bg-gradient-to-b dark:from-blue-700 dark:to-blue-900 from-blue-200 to-blue-500"></div>
            </div>
        </div>
    );
};

export default UseScrollExample;`,
        api: [
            {
                param: 'ref',
                type: 'RefObject<HTMLElement> | undefined',
                description: 'Optional ref to the element you want to track scroll on. Defaults to window if not provided.'
            }
        ],
        returns: [
            {name: 'x', type: 'number', description: 'The horizontal scroll position in pixels.'},
            {name: 'y', type: 'number', description: 'The vertical scroll position in pixels.'},
            {
                name: 'direction',
                type: '"up" | "down" | "left" | "right" | null',
                description: 'The direction of the last scroll event.'
            }
        ]
    },

};
