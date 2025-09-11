import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import {
    useClickOutside,
    useCopyToClipboard,
    useCounter,
    useDebounce,
    useHover, useInterval,
    useToggle, useWindowSize
} from "@zenuilabs/react-hooks";

// =======================
// Demo Components
// =======================

const UseToggleDemo = () => {
    const [value, { toggle, setTrue, setFalse }] = useToggle(false);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useToggle Demo</h3>
            <div className="space-x-2 mb-3">
                <button onClick={toggle} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Toggle
                </button>
                <button onClick={setTrue} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Show
                </button>
                <button onClick={setFalse} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Hide
                </button>
            </div>
            <p className="mb-2">Status: {value ? '✅ Visible' : '❌ Hidden'}</p>
            {value && (
                <div className="p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                    <p>🎉 This content is now visible!</p>
                </div>
            )}
        </div>
    );
};

const UseCounterDemo = () => {
    const [count, { increment, decrement, reset, set }] = useCounter(0);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useCounter Demo</h3>
            <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600">{count}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={increment} className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Increment (+1)
                </button>
                <button onClick={decrement} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Decrement (-1)
                </button>
                <button onClick={reset} className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Reset to 0
                </button>
                <button onClick={() => set(10)} className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                    Set to 10
                </button>
            </div>
        </div>
    );
};

const UseHoverDemo = () => {
    const [hoverRef, isHovered] = useHover();

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useHover Demo</h3>
            <div
                ref={hoverRef}
                className={`p-6 rounded-lg transition-all duration-300 cursor-pointer text-center ${
                    isHovered
                        ? 'bg-linear-to-r from-blue-400 to-purple-500 text-white transform scale-105 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:shadow-md'
                }`}
            >
                <div className="text-2xl mb-2">
                    {isHovered ? '🎉' : '👋'}
                </div>
                <p className="font-medium">
                    {isHovered ? 'Currently hovering!' : 'Hover over this area'}
                </p>
            </div>
        </div>
    );
};

const UseClickOutsideDemo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const ref = useClickOutside(() => {
        setIsOpen(false);
        setClickCount(c => c + 1);
    });

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useClickOutside Demo</h3>
            <p className="text-sm text-gray-600 mb-3">Outside clicks detected: {clickCount}</p>
            <div ref={ref} className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-2 rounded font-medium ${
                        isOpen
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isOpen ? '🔽 Close Dropdown' : '🔼 Open Dropdown'}
                </button>
                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 p-4 bg-white border rounded-lg shadow-xl z-10 min-w-[250px]">
                        <div className="mb-2">
                            <h4 className="font-medium text-gray-800">Dropdown Menu</h4>
                        </div>
                        <div className="space-y-2">
                            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                Menu Item 1
                            </button>
                            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                                Menu Item 2
                            </button>
                            <hr className="my-2"/>
                            <p className="text-xs text-gray-500">Click anywhere outside to close</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const UseCopyToClipboardDemo = () => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();
    const [customText, setCustomText] = useState('Hello from useClipboard!');

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useCopyToClipboard Demo</h3>
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text to copy:
                    </label>
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => copyToClipboard(customText)}
                    className={`px-4 py-2 rounded font-medium transition-all ${
                        isCopied
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isCopied ? '✅ Copied to clipboard!' : '📋 Copy to clipboard'}
                </button>
            </div>
        </div>
    );
};

const UseDebounceDemo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState([]);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useDebounce Demo</h3>
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search (500ms debounce):
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Start typing to search..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="text-sm text-gray-600">
                    <p>Current input: &#34;{searchTerm}&#34;</p>
                    <p>Debounced value: &#34;{debouncedSearchTerm}&#34;</p>
                </div>
                {searchResults.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium mb-2">Search Results:</p>
                        <ul className="space-y-1">
                            {searchResults.map((result, index) => (
                                <li key={index} className="text-sm text-gray-700">• {result}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const UseWindowSizeDemo = () => {
    const { width, height } = useWindowSize();

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useWindowSize Demo</h3>
            <div className="space-y-2">
                <p className="text-lg">
                    <span className="font-medium">Width:</span> {width}px
                </p>
                <p className="text-lg">
                    <span className="font-medium">Height:</span> {height}px
                </p>
                <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                        {width && width < 768 ? '📱 Mobile view detected' : '🖥️ Desktop view detected'}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        Resize your browser window to see changes
                    </p>
                </div>
            </div>
        </div>
    );
};

const UseIntervalDemo = () => {
    const [count, setCount] = useState(0);
    const [delay, setDelay] = useState(1000);
    const [isRunning, setIsRunning] = useState(false);

    useInterval(() => {
        setCount(count => count + 1);
    }, isRunning ? delay : null);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3 text-lg">useInterval Demo</h3>
            <div className="space-y-3">
                <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">{count}</span>
                </div>
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`px-4 py-2 rounded font-medium ${
                            isRunning
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                        onClick={() => setCount(0)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Reset
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interval delay: {delay}ms
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={delay}
                        onChange={(e) => setDelay(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

// Hook Component Registry
const hookComponents:Record<string, React.FC> = {
    usetoggle: UseToggleDemo,
    usecounter: UseCounterDemo,
    usehover: UseHoverDemo,
    useclickoutside: UseClickOutsideDemo,
    usecopytoclipboard: UseCopyToClipboardDemo,
    usedebounce: UseDebounceDemo,
    usewindowsize: UseWindowSizeDemo,
    useinterval: UseIntervalDemo,
};

interface HookRendererProps {
    hookName: string;
}

export const HookRenderer: React.FC<HookRendererProps> = ({ hookName }) => {
    const normalizedHookName = hookName?.toLowerCase().replace(/[^a-z]/g, '');
    const HookComponent = hookComponents[normalizedHookName];

    if (!HookComponent) {
        return (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500">Hook &#34;{hookName}&#34; not found</p>
                <p className="text-sm text-gray-400 mt-1">
                    Available hooks: {Object.keys(hookComponents).join(', ')}
                </p>
            </div>
        );
    }

    return <HookComponent />;
};
