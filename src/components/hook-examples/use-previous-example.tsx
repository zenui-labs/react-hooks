import React from "react";
import {useCounter, usePrevious} from "@zenuilabs/react-hooks";

const UsePreviousExample = () => {
    const {count, increment, decrement, reset} = useCounter(0)

    const prevCount = usePrevious(count);

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

export default UsePreviousExample;
