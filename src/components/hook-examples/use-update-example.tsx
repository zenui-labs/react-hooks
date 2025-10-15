import React, {useState} from "react";
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

export default UseUpdateExample;
