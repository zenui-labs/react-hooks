import React, {useState} from "react";
import {useHash} from "@zenuilabs/react-hooks";

const UseHashExample = () => {
    const {hash, setHash} = useHash();
    const [input, setInput] = useState(hash.replace('#', ''));

    const handleUpdate = () => {
        setHash(input);
    };

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <p className="text-gray-700 dark:text-gray-300">
                Current Hash: <span className="font-semibold">{hash || "None"}</span>
            </p>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="max-w-md rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter new hash value"
            />

            <button
                onClick={handleUpdate}
                className="px-4 w-max py-2 rounded-md bg-brandColor text-white transition-all"
            >
                Update Hash
            </button>
        </div>
    );
};

export default UseHashExample;