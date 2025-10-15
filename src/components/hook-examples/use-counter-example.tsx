import React from "react";
import {useCounter} from "@zenuilabs/react-hooks";
import {Minus, Plus} from "lucide-react";

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

export default UseCounterExample;
