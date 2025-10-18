export const hooksData: Record<string, any> = {
    uselocalstorage: {
        name: 'useLocalStorage',
        description: 'Persist state in localStorage with automatic JSON serialization and synchronization',
        category: 'State Management',
        mostUse: true,
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
        mostUse: true,
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
            <p className="dark:text-[#f4f4f4]/70 mb-7">
                You have visited this page <strong
                className='dark:text-[#f4f4f4]'>{value}</strong> {value === 1 ? "time" : "times"} this session.
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
        category: 'Performance',
        mostUse: true,
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
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B03A9]"
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
        mostUse: true,
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
                className="px-4 py-2 bg-[#3B03A9] active:scale-[0.95] transition-transform duration-100 hover:bg-[#3B03A9]/80 cursor-pointer text-white rounded-lg text-sm font-medium"
            >
                Toggle
            </button>

            <button
                onClick={setTrue}
                disabled={value}
                className="px-4 disabled:cursor-not-allowed disabled:bg-gray-100 ml-3 py-2 border border-gray-200 cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:disabled:bg-gray-800 dark:text-[#f4f4f4] rounded-lg text-sm font-medium"
            >
                Set true
            </button>

            <button
                onClick={setFalse}
                disabled={!value}
                className="px-4 ml-3 disabled:cursor-not-allowed disabled:bg-gray-100 py-2 border border-gray-200 cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:disabled:bg-gray-800 dark:text-[#f4f4f4] rounded-lg text-sm font-medium"
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
        mostUse: true,
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
                    className="px-4 py-2 bg-[#3B03A9] cursor-pointer text-white rounded hover:bg-[#3B03A9]/80 transition-colors"
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
        category: 'Performance',
        mostUse: true,
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
        mostUse: true,
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
        description: 'Manage the lifecycle of asynchronous operations (loading, success, error) with built-in state management.',
        category: 'Data Fetching',
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
            <h2 className="text-2xl font-bold mb-6 dark:text-[#f4f4f4]">Async User Fetcher</h2>

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
                    <div className="space-y-2 dark:text-[#f4f4f4]/80">
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
        category: 'DOM & Events',
        usage: `import {useHover} from "@zenuilabs/react-hooks";

const UseHoverExample = () => {
    const {ref, isHovered} = useHover<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={\`rounded-xl p-8 transition-colors
                \${isHovered ? 'bg-[#3B03A9] text-white' : 'bg-gray-50 !text-gray-900'}
                dark:\${isHovered ? 'bg-[#3B03A9] text-white' : 'bg-gray-900 text-white'}
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
                    \${isHovered ? 'bg-white text-[#3B03A9] hover:bg-gray-100' : 'bg-[#3B03A9] text-white hover:bg-[#3B03A9]'}
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
        description: 'Detect clicks or touches outside a referenced element and trigger a handler function.',
        category: 'DOM & Events',
        mostUse: true,
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
                    className="px-4 py-2 rounded-md bg-[#3B03A9] text-white hover:bg-[#3B03A9]/90 transition-colors"
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
        category: 'DOM & Events',
        mostUse: true,
        usage: `import React from "react";
import {useWindowSize} from "@zenuilabs/react-hooks";

const WindowSizeCard = () => {
    const {width, height} = useWindowSize();

    return (
        <div className="flex justify-center p-16 rounded-xl flex-col dark:text-[#f4f4f4] bg-gray-100 dark:bg-gray-900">
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
        category: 'DOM & Events',
        usage: `import React from "react";
import {useKeyPress} from "@zenuilabs/react-hooks";

const KeyPressCard = () => {
    const isEnterPressed = useKeyPress("Enter");

    return (
        <div className="flex justify-center dark:text-[#f4f4f4] flex-col rounded-xl p-16 bg-gray-100 dark:bg-gray-900">
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
        category: 'DOM & Events',
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
        category: 'DOM & Events',
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
    usedrop: {
        name: 'useDrop',
        description: 'Handle drag-and-drop interactions on an element, including detecting when an item is dragged over and dropped.',
        category: 'DOM & Events',
        usage: `import {useDrop} from "@zenuilabs/react-hooks";

export default function UseDropExample() {
    const {ref, isOver, data, handlers} = useDrop<HTMLDivElement>();

    const displayData = () => {
        if (!data) return 'None';

        if (typeof data === 'string') {
            return data;
        }

        if (data instanceof FileList) {
            return Array.from(data)
                .map((file) => file.name)
                .join(', ');
        }

        return 'Unknown data type';
    };

    const handleDragStart = (e: React.DragEvent, text: string) => {
        e.dataTransfer.setData('text/plain', text);
    };

    return (
        <div className="flex justify-center dark:text-[#f4f4f4] flex-col rounded-xl p-16 bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-2xl space-y-6">
                {/* Status Display */}
                <div className="rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800">
                    <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                            Drag State:{' '}
                            <strong
                                className={isOver ? 'text-[#3B03A9] dark:text-purple-400' : 'text-gray-900 dark:text-white'}>
                                {isOver ? 'Dragging Over' : 'Idle'}
                            </strong>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Dropped Data:{' '}
                            <strong className="text-gray-900 dark:text-white break-all">
                                {displayData()}
                            </strong>
                        </p>
                    </div>
                </div>

                {/* Draggable Items */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Try dragging these:
                </h2>
                <div className="flex gap-4">
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'Hello from draggable item 1!')}
                        className="p-4 bg-blue-500 text-white rounded-lg cursor-move hover:bg-blue-600 transition-colors text-center"
                    >
                        Drag me! (Item 1)
                    </div>

                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'This is draggable item 2')}
                        className="p-4 bg-green-500 text-white rounded-lg cursor-move hover:bg-green-600 transition-colors text-center"
                    >
                        Drag me! (Item 2)
                    </div>

                    <div
                        draggable 
                        onDragStart={(e) => handleDragStart(e, 'This is draggable item 3')}
                        className="p-4 bg-purple-500 text-white rounded-lg cursor-move hover:bg-purple-600 transition-colors text-center"
                    >
                        Drag me! (Item 3)
                    </div>
                </div>

                {/* Drop Zone */}
                <div
                    ref={ref}
                    {...handlers}
                    className={\`h-64 flex items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 \${isOver
                ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40'
                : 'border-gray-200 dark:border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800'
        }\`}
                >
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                        Drop Zone
                    </p>
                </div>
            </div>
        </div>
    );
}`,
        api: [
            {
                param: 'T',
                type: 'HTMLElement',
                description: 'Generic type for the element being used as the drop target.'
            }
        ],
        returns: [
            {name: 'ref', type: 'RefObject<HTMLElement>', description: 'A ref to attach to the drop target element.'},
            {
                name: 'isOver',
                type: 'boolean',
                description: 'Whether an item is currently being dragged over the target.'
            },
            {name: 'data', type: 'any | null', description: 'The dropped data, if any (via DataTransfer API).'},
            {
                name: 'handlers',
                type: 'DropHandlers',
                description: 'Object containing `onDragOver`, `onDragLeave`, and `onDrop` event handlers to spread on your target element.'
            }
        ]
    },
    usedroparea: {
        name: 'useDropArea',
        description: 'Handle file drag-and-drop interactions within a specific area. Provides real-time feedback when files are dragged over and captures the dropped file list.',
        category: 'DOM & Events',
        usage: `import React from "react";
import {useDropArea} from "@zenuilabs/react-hooks";

const UseDropAreaExample = () => {
    const {ref, isOver, files, handlers} = useDropArea<HTMLDivElement>();

    return (
        <div className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            {/* Info Panel */}
            <div className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md">
                <p>Status: <strong>{isOver ? "Dragging Files..." : "Idle"}</strong></p>
                <p>Total Files: <strong>{files.length}</strong></p>
                {files.length > 0 && (
                    <ul className="mt-3 list-disc list-inside space-y-1 text-sm">
                        {files.map((file, i) => (
                            <li key={i}>
                                {file.name} <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Drop Zone */}
            <div
                ref={ref}
                {...handlers}
                className={\`h-64 w-full max-w-md flex items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer \${isOver ? "border-green-500 bg-green-100 dark:bg-green-900/40" : "border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"}\`}
            >
                <p className="text-gray-600 dark:text-gray-300 text-center px-4">
                    Drag & drop files here or click to select
                </p>
            </div>
        </div>
    );
};

export default UseDropAreaExample;`,
        api: [
            {
                param: 'T',
                type: 'HTMLElement',
                description: 'Generic type for the element being used as the drop area.'
            }
        ],
        returns: [
            {
                name: 'ref',
                type: 'RefObject<HTMLElement>',
                description: 'Attach this ref to the element that should act as the file drop zone.'
            },
            {name: 'isOver', type: 'boolean', description: 'True while files are being dragged over the drop area.'},
            {name: 'files', type: 'File[]', description: 'Array of dropped File objects with name, type, and size.'},
            {
                name: 'handlers',
                type: 'DropAreaHandlers',
                description: 'Object containing `onDragOver`, `onDragLeave`, and `onDrop` event handlers to spread onto the drop area.'
            }
        ]
    },
    useevent: {
        name: 'useEvent',
        description: 'Easily attach and clean up DOM or window event listeners in React. Automatically handles binding to elements, refs, or global targets with proper cleanup.',
        category: 'DOM & Events',
        usage: `import React, {useRef, useState} from "react";
import {useEvent} from "@zenuilabs/react-hooks";

const UseEventExample = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [boxClicks, setBoxClicks] = useState(0);

    // Listen to window resize events
    useEvent("resize", () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });

    // Listen to clicks on a specific element
    useEvent("click", () => {
        setBoxClicks((prev) => prev + 1);
    }, boxRef);

    return (
        <div className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            {/* Info Panel */}
            <div className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md space-y-2">
                <p>Window Width: <strong>{windowSize.width}px</strong></p>
                <p>Window Height: <strong>{windowSize.height}px</strong></p>
                <p>Box Clicks: <strong>{boxClicks}</strong></p>
            </div>

            {/* Event Target Element */}
            <div
                ref={boxRef}
                className="h-48 w-full max-w-md flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 cursor-pointer transition-all hover:scale-[1.02]"
            >
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                    Click Me (tracked with useEvent)
                </p>
            </div>
        </div>
    );
};

export default UseEventExample;`,
        api: [
            {
                param: 'type',
                type: 'keyof WindowEventMap',
                description: 'The name of the event to listen for (e.g., "resize", "click", "keydown").'
            },
            {
                param: 'listener',
                type: '(event: WindowEventMap[K]) => void',
                description: 'Callback function triggered when the event fires.'
            },
            {
                param: 'target',
                type: 'RefObject<HTMLElement> | HTMLElement | Window | Document',
                description: 'The target to attach the event listener to. Defaults to window if not provided.'
            },
            {
                param: 'options',
                type: 'AddEventListenerOptions',
                description: 'Optional event listener options like `capture`, `once`, or `passive`.'
            }
        ],
        returns: [
            {
                name: 'void',
                type: '—',
                description: 'This hook doesn’t return anything; it automatically handles listener registration and cleanup.'
            }
        ]
    },
    usecopytoclipboard: {
        name: 'useCopyToClipboard',
        description: 'Copy any text to the user’s clipboard and track the copy state for UI feedback (e.g., showing a “Copied!” message).',
        category: 'Utilities',
        usage: `import React, {useState} from "react";
import {useCopyToClipboard} from "@zenuilabs/react-hooks";
import {Check, Copy} from "lucide-react";

const UseCopyToClipboardExample = () => {
    const {isCopied, copyToClipboard} = useCopyToClipboard();
    const [text, setText] = useState("Hello from ZenUI Hooks! 🚀");

    return (
        <div className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            {/* Info Panel */}
            <div className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type or modify text below, then click “Copy” to copy it to your clipboard.
                </p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-accent"
                    rows={3}
                />

                <button
                    onClick={() => copyToClipboard(text)}
                    className="inline-flex items-center justify-center space-x-2 rounded-md bg-accent hover:bg-accent-dark text-white px-4 py-2 transition-all"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-4 h-4" /> <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" /> <span>Copy Text</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UseCopyToClipboardExample;`,
        api: [
            {
                param: 'copyToClipboard',
                type: '(text: string) => Promise<void>',
                description: 'Function that copies the provided text to the clipboard.'
            }
        ],
        returns: [
            {
                name: 'isCopied',
                type: 'boolean',
                description: 'Indicates whether the text was recently copied (resets after 2 seconds).'
            },
            {
                name: 'copyToClipboard',
                type: '(text: string) => Promise<void>',
                description: 'Triggers copying text to the clipboard.'
            }
        ]
    },
    useinterval: {
        name: 'useInterval',
        description: 'Run a callback function at a specified time interval, with full React lifecycle support and dynamic delay control.',
        category: 'Utilities',
        usage: `import React, {useState} from "react";
import {useInterval} from "@zenuilabs/react-hooks";

const UseIntervalExample = () => {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    // 🕒 Increment count every second when running
    useInterval(() => {
        setCount((prev) => prev + 1);
    }, isRunning ? 1000 : null); // Passing null pauses the interval

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Interval Counter
            </h2>

            <div className="text-5xl font-bold text-accent">{count}</div>

            <div className="flex space-x-3">
                <button
                    onClick={() => setIsRunning(true)}
                    disabled={isRunning}
                    className="px-4 py-2 rounded-md bg-green-500 text-white disabled:bg-gray-400 transition-all"
                >
                    Start
                </button>

                <button
                    onClick={() => setIsRunning(false)}
                    disabled={!isRunning}
                    className="px-4 py-2 rounded-md bg-red-500 text-white disabled:bg-gray-400 transition-all"
                >
                    Stop
                </button>

                <button
                    onClick={() => setCount(0)}
                    className="px-4 py-2 rounded-md bg-gray-500 text-white transition-all"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default UseIntervalExample;`,
        api: [
            {
                param: 'callback',
                type: '() => void',
                description: 'The function to be executed at each interval tick.'
            },
            {
                param: 'delay',
                type: 'number | null',
                description: 'The delay (in milliseconds) for the interval. Pass `null` to pause execution.'
            }
        ],
        returns: [
            {
                name: 'void',
                type: 'void',
                description: 'This hook does not return any value; it manages intervals internally.'
            }
        ]
    },
    usecookie: {
        name: 'useCookie',
        description: 'A React hook to easily get, set, and remove cookies with optional configuration for expiration, path, and security settings.',
        category: 'Utilities',
        usage: `import React, {useState} from "react";
import {useCookie} from "@zenuilabs/react-hooks";

const UseCookieExample = () => {
    const {value: username, setValue: setUsernameCookie, remove: removeUsernameCookie} = useCookie("username", "Guest");
    const [inputValue, setInputValue] = useState(username);

    const handleSave = () => {
        setUsernameCookie(inputValue, {
            path: "/",
            maxAge: 3600, // 1 hour
            sameSite: "Lax"
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Cookie Manager</h2>

            <div className="w-full space-y-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter your name"
                />

                <div className="flex space-x-3">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md bg-accent hover:bg-accent-dark text-white transition-all"
                    >
                        Save Cookie
                    </button>

                    <button
                        onClick={removeUsernameCookie}
                        className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Current Cookie:</span> {username || "No cookie set"}
            </p>
        </div>
    );
};

export default UseCookieExample;`,
        api: [
            {
                param: 'name',
                type: 'string',
                description: 'The name of the cookie to read and manage.'
            },
            {
                param: 'initialValue',
                type: 'string',
                description: 'Initial fallback value if the cookie is not found.'
            }
        ],
        returns: [
            {
                name: 'value',
                type: 'string',
                description: 'The current value of the cookie.'
            },
            {
                name: 'setValue',
                type: '(newValue: string, options?: CookieOptions) => void',
                description: 'Updates or creates the cookie with optional configuration (e.g., expires, path, maxAge).'
            },
            {
                name: 'remove',
                type: '() => void',
                description: 'Removes the cookie by setting its max-age to 0.'
            }
        ]
    },
    usegeolocation: {
        name: 'useGeolocation',
        description: 'Tracks the user’s current geolocation (latitude, longitude, accuracy) and provides any errors if the location cannot be retrieved.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useGeolocation} from "@zenuilabs/react-hooks";

const UseGeolocationExample = () => {
    const {latitude, longitude, accuracy, error} = useGeolocation();

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Current Location
            </h2>

            {error ? (
                <p className="text-red-500 dark:text-red-400">{error}</p>
            ) : (
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                    <p><span className="font-semibold">Latitude:</span> {latitude ?? "Loading..."}</p>
                    <p><span className="font-semibold">Longitude:</span> {longitude ?? "Loading..."}</p>
                    <p><span className="font-semibold">Accuracy:</span> {accuracy ? \`\${accuracy} meters\` : "Loading..."}</p>
                </div>
            )}
        </div>
    );
};

export default UseGeolocationExample;`,
        api: [],
        returns: [
            {
                name: 'latitude',
                type: 'number | null',
                description: 'The current latitude of the user or null if not available.'
            },
            {
                name: 'longitude',
                type: 'number | null',
                description: 'The current longitude of the user or null if not available.'
            },
            {
                name: 'accuracy',
                type: 'number | null',
                description: 'The accuracy of the geolocation in meters or null if not available.'
            },
            {
                name: 'error',
                type: 'string | null',
                description: 'Error message if geolocation could not be retrieved, otherwise null.'
            }
        ]
    },
    usehash: {
        name: 'useHash',
        description: 'Read and update the current URL hash. Automatically tracks changes to the hash and provides a function to update it programmatically.',
        category: 'Browser & Device',
        usage: `import React, {useState} from "react";
import {useHash} from "@zenuilabs/react-hooks";

const UseHashExample = () => {
    const {hash, setHash} = useHash();
    const [input, setInput] = useState(hash.replace('#', ''));

    const handleUpdate = () => {
        setHash(input);
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                URL Hash Manager
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
                Current Hash: <span className="font-semibold">{hash || "None"}</span>
            </p>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter new hash value"
            />

            <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-md bg-accent hover:bg-accent-dark text-white transition-all"
            >
                Update Hash
            </button>
        </div>
    );
};

export default UseHashExample;`,
        api: [],
        returns: [
            {
                name: 'hash',
                type: 'string',
                description: 'The current URL hash, including the `#` symbol.'
            },
            {
                name: 'setHash',
                type: '(newHash: string) => void',
                description: 'Function to update the URL hash programmatically. Automatically adds `#` if missing.'
            }
        ]
    },
    useidle: {
        name: 'useIdle',
        description: 'Detects when the user is idle based on mouse, keyboard, touch, and scroll events. Returns a boolean indicating whether the user is currently idle.',
        category: 'Browser & Device',
        usage: `import React, {useState} from "react";
import {useIdle} from "@zenuilabs/react-hooks";

const UseIdleExample = () => {
    const {isIdle} = useIdle(10000); // 10 seconds timeout
    const [lastActiveTime, setLastActiveTime] = useState(new Date().toLocaleTimeString());

    // Update last active time when user is active
    React.useEffect(() => {
        if (!isIdle) {
            setLastActiveTime(new Date().toLocaleTimeString());
        }
    }, [isIdle]);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                User Idle Detection
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
                Status: <span className="font-semibold">{isIdle ? "Idle" : "Active"}</span>
            </p>

            {!isIdle && (
                <p className="text-gray-600 dark:text-gray-400">
                    Last Active At: {lastActiveTime}
                </p>
            )}

            {isIdle && (
                <p className="text-red-500 dark:text-red-400">
                    You have been idle for 10 seconds!
                </p>
            )}
        </div>
    );
};

export default UseIdleExample;`,
        api: [
            {
                param: 'timeout',
                type: 'number',
                description: 'Optional idle timeout in milliseconds. Default is 60000 (60 seconds).'
            }
        ],
        returns: [
            {
                name: 'isIdle',
                type: 'boolean',
                description: 'Indicates whether the user is currently idle (true) or active (false).'
            }
        ]
    },
    useintersection: {
        name: 'useIntersection',
        description: 'Tracks whether an element is currently visible in the viewport using the Intersection Observer API.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useIntersection} from "@zenuilabs/react-hooks";

const UseIntersectionExample = () => {
    const {ref, isIntersecting} = useIntersection({ threshold: 0.5 });

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Intersection Observer Example
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
                The box below is {isIntersecting ? "visible" : "not visible"} in the viewport.
            </p>

            <div className="h-40 w-full overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                <div style={{height: "600px"}} className="relative">
                    <div
                        ref={ref}
                        className={\`w-full h-32 rounded-md flex items-center justify-center text-white font-bold transition-all \${isIntersecting ? "bg-green-500" : "bg-gray-400"}\`}
                    >
                        {isIntersecting ? "Visible" : "Not Visible"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseIntersectionExample;`,
        api: [
            {
                param: 'options',
                type: 'IntersectionObserverInit',
                description: 'Optional configuration for the IntersectionObserver, e.g., `root`, `rootMargin`, and `threshold`.'
            }
        ],
        returns: [
            {
                name: 'ref',
                type: 'RefObject<HTMLElement>',
                description: 'Attach this ref to the element you want to observe.'
            },
            {
                name: 'isIntersecting',
                type: 'boolean',
                description: 'Indicates whether the element is currently visible in the viewport based on the observer options.'
            }
        ]
    },
    uselocation: {
        name: 'useLocation',
        description: 'Tracks the current browser location, including pathname, search query, and hash. Updates automatically when the URL changes.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useLocation} from "@zenuilabs/react-hooks";

const UseLocationExample = () => {
    const {pathname, search, hash} = useLocation();

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Current Location Tracker
            </h2>

            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><span className="font-semibold">Pathname:</span> {pathname}</p>
                <p><span className="font-semibold">Search:</span> {search || "None"}</p>
                <p><span className="font-semibold">Hash:</span> {hash || "None"}</p>
            </div>
        </div>
    );
};

export default UseLocationExample;`,
        api: [],
        returns: [
            {
                name: 'pathname',
                type: 'string',
                description: 'The current URL pathname (e.g., "/about").'
            },
            {
                name: 'search',
                type: 'string',
                description: 'The current URL query string (e.g., "?id=123").'
            },
            {
                name: 'hash',
                type: 'string',
                description: 'The current URL hash (e.g., "#section1").'
            }
        ]
    },
    uselockbodyscroll: {
        name: 'useLockBodyScroll',
        description: 'Locks or unlocks scrolling on the body element.',
        category: 'DOM & Events',
        usage: `import React, {useState} from "react";
import {useLockBodyScroll} from "@zenuilabs/react-hooks";

const UseLockBodyScrollExample = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lock body scroll when modal is open
    useLockBodyScroll(isModalOpen);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Lock Body Scroll Example
            </h2>

            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-md bg-accent hover:bg-accent-dark text-white transition-all"
            >
                Open Modal
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center space-y-4">
                        <p className="text-gray-900 dark:text-white">
                            Body scroll is locked while this modal is open.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                        >
                            Close Modal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UseLockBodyScrollExample;`,
        api: [
            {
                param: 'lock',
                type: 'boolean',
                description: 'Optional. Pass `true` to lock body scroll, `false` to unlock. Default is `true`.'
            }
        ],
        returns: []
    },
    usemedia: {
        name: 'useMedia',
        description: 'Tracks whether a given CSS media query currently matches. Updates in real-time when the viewport changes.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useMedia} from "@zenuilabs/react-hooks";

const UseMediaExample = () => {
    const {matches: isMobile} = useMedia("(max-width: 768px)");

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Responsive Media Query
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
                Current viewport: <span className="font-semibold">{isMobile ? "Mobile" : "Desktop"}</span>
            </p>

            <div
                className={\`w-full h-40 rounded-lg flex items-center justify-center font-bold text-white transition-all \${isMobile ? "bg-blue-500" : "bg-green-500"}\`}
            >
                {isMobile ? "Mobile Layout" : "Desktop Layout"}
            </div>
        </div>
    );
};

export default UseMediaExample;`,
        api: [
            {
                param: 'query',
                type: 'string',
                description: 'The CSS media query to evaluate (e.g., "(max-width: 768px)").'
            },
            {
                param: 'defaultState',
                type: 'boolean',
                description: 'Optional. The initial state before the first evaluation. Defaults to false.'
            }
        ],
        returns: [
            {
                name: 'matches',
                type: 'boolean',
                description: 'Indicates whether the media query currently matches.'
            }
        ]
    },
    usemediadevices: {
        name: 'useMediaDevices',
        description: 'Fetches the list of available media devices (microphones, cameras, speakers) and updates automatically when devices change.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useMediaDevices} from "@zenuilabs/react-hooks";

const UseMediaDevicesExample = () => {
    const {devices} = useMediaDevices();

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Media Devices
            </h2>

            {devices.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No media devices found.</p>
            ) : (
                <ul className="space-y-2 text-gray-800 dark:text-gray-200 w-full">
                    {devices.map((device) => (
                        <li key={device.deviceId} className="p-2 border border-gray-300 dark:border-gray-700 rounded-md">
                            <span className="font-semibold">{device.kind.replace("input", "Input").replace("output", "Output")}:</span> {device.label || "Unknown Device"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UseMediaDevicesExample;`,
        api: [],
        returns: [
            {
                name: 'devices',
                type: 'MediaDeviceInfoExtended[]',
                description: 'An array of media devices available to the browser, including microphones, cameras, and speakers.'
            }
        ]
    },
    usemouse: {
        name: 'useMouse',
        description: 'Tracks the mouse cursor position relative to the window or a specific element. Returns the X and Y coordinates in real-time.',
        category: 'DOM & Events',
        usage: `import React, {useRef} from "react";
import {useMouse} from "@zenuilabs/react-hooks";

const UseMouseExample = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const {x, y} = useMouse(boxRef);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Mouse Position Tracker
            </h2>

            <div
                ref={boxRef}
                className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center"
            >
                <div
                    className="absolute w-6 h-6 bg-accent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: x, top: y }}
                ></div>
                <p className="text-gray-900 dark:text-white font-medium z-10">
                    X: {x}px, Y: {y}px
                </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                Move your mouse inside the box to track coordinates relative to it.
            </p>
        </div>
    );
};

export default UseMouseExample;`,
        api: [
            {
                param: 'ref',
                type: 'RefObject<HTMLElement> | undefined',
                description: 'Optional. If provided, mouse coordinates are relative to this element. Otherwise, they are relative to the window.'
            }
        ],
        returns: [
            {
                name: 'x',
                type: 'number',
                description: 'The current X position of the mouse relative to the element or window.'
            },
            {
                name: 'y',
                type: 'number',
                description: 'The current Y position of the mouse relative to the element or window.'
            }
        ]
    },
    usemousewheel: {
        name: 'useMouseWheel',
        description: 'Tracks mouse wheel events and returns the scroll deltas (deltaX, deltaY, deltaZ) in real-time.',
        category: 'DOM & Events',
        usage: `import React, {useRef} from "react";
import {useMouseWheel} from "@zenuilabs/react-hooks";

const UseMouseWheelExample = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {deltaX, deltaY, deltaZ} = useMouseWheel(containerRef);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Mouse Wheel Tracker
            </h2>

            <div
                ref={containerRef}
                className="h-64 w-full max-w-md overflow-auto rounded-lg bg-gray-50 dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700"
            >
                <div style={{height: '1200px', width: '100%'}} className="bg-gradient-to-b from-blue-200 to-blue-500 dark:from-blue-700 dark:to-blue-900"></div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                deltaX: <span className="font-semibold">{deltaX}</span> px
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                deltaY: <span className="font-semibold">{deltaY}</span> px
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                deltaZ: <span className="font-semibold">{deltaZ}</span> px
            </p>
        </div>
    );
};

export default UseMouseWheelExample;`,
        api: [
            {
                param: 'ref',
                type: 'RefObject<HTMLElement> | undefined',
                description: 'Optional. If provided, wheel events are tracked relative to this element. Otherwise, they are tracked on the window.'
            }
        ],
        returns: [
            {
                name: 'deltaX',
                type: 'number',
                description: 'The horizontal scroll amount of the mouse wheel event in pixels.'
            },
            {
                name: 'deltaY',
                type: 'number',
                description: 'The vertical scroll amount of the mouse wheel event in pixels.'
            },
            {
                name: 'deltaZ',
                type: 'number',
                description: 'The Z-axis scroll amount of the mouse wheel event (rarely used).'
            }
        ]
    },
    usenetworkstate: {
        name: 'useNetworkState',
        description: 'Tracks the browser network state in real-time. Returns whether the user is online and the timestamp since the last change.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useNetworkState} from "@zenuilabs/react-hooks";

const UseNetworkStateExample = () => {
    const {online, since} = useNetworkState();

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Network Status Tracker
            </h2>

            <p className={\`text-lg font-medium \${online ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}\`}>
                {online ? "Online" : "Offline"}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
                {since ? \`Status changed at: \${since.toLocaleTimeString()}\` : "Initializing..."}
            </p>
        </div>
    );
};

export default UseNetworkStateExample;`,
        api: [],
        returns: [
            {
                name: 'online',
                type: 'boolean',
                description: 'Indicates whether the browser is currently online.'
            },
            {
                name: 'since',
                type: 'Date | undefined',
                description: 'The timestamp when the network state last changed.'
            }
        ]
    },
    usepageleave: {
        name: 'usePageLeave',
        description: 'Detects when the user attempts to leave the page (e.g., closing the tab or refreshing) and triggers a callback.',
        category: 'Browser & Device',
        usage: `import React, {useState} from "react";
import {usePageLeave} from "@zenuilabs/react-hooks";

const UsePageLeaveExample = () => {
    const [message, setMessage] = useState("Try refreshing or closing the page!");

    usePageLeave((event) => {
        // Optional: Custom logic before leaving
        console.log("Page leave detected!");
        setMessage("You attempted to leave the page!");
        // Default browser confirmation
        event && (event.returnValue = "Are you sure you want to leave?");
    });

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Page Leave Detection
            </h2>

            <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
    );
};

export default UsePageLeaveExample;`,
        api: [
            {
                param: 'callback',
                type: '(event?: BeforeUnloadEvent) => void',
                description: 'A function triggered when the user attempts to leave the page. You can optionally modify the `event` to show a confirmation dialog.'
            }
        ],
        returns: []
    },
    usesearchparam: {
        name: 'useSearchParam',
        description: 'Gets and sets a specific URL search parameter in real-time. Automatically updates the state when the URL changes via browser navigation.',
        category: 'Browser & Device',
        usage: `import React, {useState} from "react";
import {useSearchParam} from "@zenuilabs/react-hooks";

const UseSearchParamExample = () => {
    const {value: searchValue, setValue: setSearchValue} = useSearchParam("query");
    const [input, setInput] = useState(searchValue || "");

    const handleUpdate = () => {
        setSearchValue(input || null);
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Search Parameter Tracker
            </h2>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a search query..."
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent"
            />

            <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-md bg-accent hover:bg-accent-dark text-white transition-all"
            >
                Update Search Param
            </button>

            <p className="text-gray-700 dark:text-gray-300">
                Current search parameter: <span className="font-semibold">{searchValue || "None"}</span>
            </p>
        </div>
    );
};

export default UseSearchParamExample;`,
        api: [
            {
                param: 'key',
                type: 'string',
                description: 'The key of the URL search parameter to read and update.'
            }
        ],
        returns: [
            {
                name: 'value',
                type: 'string | null',
                description: 'The current value of the specified search parameter.'
            },
            {
                name: 'setValue',
                type: '(newValue: string | null) => void',
                description: 'Function to update the search parameter. Pass `null` to remove it from the URL.'
            }
        ]
    },
    usevisibilitychange: {
        name: 'useVisibilityChange',
        description: 'Tracks the visibility state of the document. Returns whether the page is currently visible or hidden, updating in real-time.',
        category: 'Browser & Device',
        usage: `import React from "react";
import {useVisibilityChange} from "@zenuilabs/react-hooks";

const UseVisibilityChangeExample = () => {
    const {visible, hidden} = useVisibilityChange();

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Page Visibility Tracker
            </h2>

            <p className={\`text-lg font-medium \${visible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}\`}>
                {visible ? "Page is Visible" : "Page is Hidden"}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
                Hidden: <span className="font-semibold">{hidden ? "Yes" : "No"}</span>
            </p>
        </div>
    );
};

export default UseVisibilityChangeExample;`,
        api: [],
        returns: [
            {
                name: 'visible',
                type: 'boolean',
                description: 'Indicates whether the page is currently visible to the user.'
            },
            {
                name: 'hidden',
                type: 'boolean',
                description: 'Indicates whether the page is currently hidden (not visible to the user).'
            }
        ]
    },
    usevideo: {
        name: 'useVideo',
        description: 'Manages video playback with full control over play, pause, stop, volume, mute, and current time.',
        category: 'Media',
        usage: `import React, {useState} from "react";
import {useVideo} from "@zenuilabs/react-hooks";

const UseVideoExample = () => {
    const {videoRef, playing, currentTime, duration, volume, muted, controls} = useVideo("https://www.w3schools.com/html/mov_bbb.mp4");
    const [volumeInput, setVolumeInput] = useState(volume);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Video Player Hook Example
            </h2>

            <video ref={videoRef} className="w-full rounded-lg bg-black" />

            <div className="flex flex-col space-y-2 w-full">
                <p className="text-gray-700 dark:text-gray-300">
                    {playing ? "Playing" : "Paused"} - {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                </p>

                <div className="flex space-x-2">
                    <button onClick={controls.play} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Play</button>
                    <button onClick={controls.pause} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Pause</button>
                    <button onClick={controls.stop} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Stop</button>
                    <button onClick={controls.toggleMute} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">
                        {muted ? "Unmute" : "Mute"}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300">Volume:</label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volumeInput}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setVolumeInput(val);
                            controls.setVolume(val);
                        }}
                        className="flex-1"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300">Seek:</label>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => controls.setTime(parseFloat(e.target.value))}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default UseVideoExample;`,
        api: [
            {
                param: 'src',
                type: 'string',
                description: 'The video source URL to load into the hook.'
            }
        ],
        returns: [
            {name: 'playing', type: 'boolean', description: 'Whether the video is currently playing.'},
            {name: 'currentTime', type: 'number', description: 'Current playback time in seconds.'},
            {name: 'duration', type: 'number', description: 'Total video duration in seconds.'},
            {name: 'volume', type: 'number', description: 'Current volume level (0 to 1).'},
            {name: 'muted', type: 'boolean', description: 'Whether the video is muted.'},
            {
                name: 'videoRef',
                type: 'RefObject<HTMLVideoElement>',
                description: 'Ref to attach to the HTMLVideoElement.'
            },
            {
                name: 'controls',
                type: 'VideoControls',
                description: 'Object containing control functions: play, pause, stop, setVolume, setTime, toggleMute.'
            }
        ]
    },
    useaudio: {
        name: 'useAudio',
        description: 'Manages audio playback with full control over play, pause, stop, volume, and current time.',
        category: 'Media',
        usage: `import React, {useState} from "react";
import {useAudio} from "@zenuilabs/react-hooks";

const UseAudioExample = () => {
    const {playing, currentTime, duration, volume, controls} = useAudio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    const [volumeInput, setVolumeInput] = useState(volume);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Audio Player Hook Example
            </h2>

            <div className="flex flex-col space-y-2 w-full">
                <p className="text-gray-700 dark:text-gray-300">
                    {playing ? "Playing" : "Paused"} - {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                </p>

                <div className="flex space-x-2">
                    <button onClick={controls.play} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Play</button>
                    <button onClick={controls.pause} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Pause</button>
                    <button onClick={controls.stop} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Stop</button>
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300">Volume:</label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volumeInput}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setVolumeInput(val);
                            controls.setVolume(val);
                        }}
                        className="flex-1"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300">Seek:</label>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => controls.setTime(parseFloat(e.target.value))}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default UseAudioExample;`,
        api: [
            {
                param: 'src',
                type: 'string',
                description: 'The audio source URL to load into the hook.'
            }
        ],
        returns: [
            {name: 'playing', type: 'boolean', description: 'Whether the audio is currently playing.'},
            {name: 'currentTime', type: 'number', description: 'Current playback time in seconds.'},
            {name: 'duration', type: 'number', description: 'Total audio duration in seconds.'},
            {name: 'volume', type: 'number', description: 'Current volume level (0 to 1).'},
            {
                name: 'audioRef',
                type: 'RefObject<HTMLAudioElement>',
                description: 'Ref to attach to the HTMLAudioElement.'
            },
            {
                name: 'controls',
                type: 'AudioControls',
                description: 'Object containing control functions: play, pause, stop, setVolume, setTime.'
            }
        ]
    },
    usefullscreen: {
        name: 'useFullscreen',
        description: 'Manage fullscreen mode for any HTML element. Provides functions to enter, exit, or toggle fullscreen, and tracks the fullscreen state.',
        category: 'DOM & Events',
        usage: `import React from "react";
import {useFullscreen} from "@zenuilabs/react-hooks";

const UseFullscreenExample = () => {
    const {ref, isFullscreen, controls} = useFullscreen<HTMLDivElement>();

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Fullscreen Hook Example
            </h2>

            <div
                ref={ref}
                className="w-full h-48 bg-blue-500 dark:bg-blue-700 rounded-lg flex items-center justify-center text-white text-lg font-semibold"
            >
                {isFullscreen ? "Fullscreen Mode" : "Click buttons to enter fullscreen"}
            </div>

            <div className="flex space-x-2">
                <button onClick={controls.enter} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Enter Fullscreen</button>
                <button onClick={controls.exit} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Exit Fullscreen</button>
                <button onClick={controls.toggle} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-md">Toggle Fullscreen</button>
            </div>
        </div>
    );
};

export default UseFullscreenExample;`,
        api: [],
        returns: [
            {
                name: 'ref',
                type: 'RefObject<T>',
                description: 'Attach this ref to the HTML element you want to control fullscreen for.'
            },
            {
                name: 'isFullscreen',
                type: 'boolean',
                description: 'Indicates whether the element is currently in fullscreen mode.'
            },
            {
                name: 'controls',
                type: 'FullscreenControls',
                description: 'Object containing control functions: enter, exit, toggle fullscreen.'
            }
        ]
    }
};
