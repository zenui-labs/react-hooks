import React, {useState} from "react";
import {useInterval} from "@zenuilabs/react-hooks";

const UseIntervalExample = () => {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    // 🕒 Increment count every second when running
    useInterval(() => {
        setCount((prev) => prev + 1);
    }, isRunning ? 1000 : null); // Passing null pauses the interval

    return (
        <div
            className="flex flex-col items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Interval Counter
            </h2>

            <div className="text-5xl font-bold dark:text-darkText text-accent">{count}</div>

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

export default UseIntervalExample;