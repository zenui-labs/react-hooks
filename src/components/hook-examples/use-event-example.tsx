import React, {useRef, useState} from "react";
import {useEvent} from "@zenuilabs/react-hooks";

const UseEventExample = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});
    const [boxClicks, setBoxClicks] = useState(0);

    // Listen to window resize events
    useEvent("resize", () => {
        setWindowSize({width: window.innerWidth, height: window.innerHeight});
    });

    // Listen to clicks on a specific element
    useEvent("click", () => {
        setBoxClicks((prev) => prev + 1);
    }, boxRef);

    return (
        <div className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            {/* Info Panel */}
            <div
                className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md space-y-2">
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

export default UseEventExample;