import React, { useState, useEffect } from "react";
import { useDebounce } from "@zenuilabs/react-hooks";

const UseDebounceExample = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 600);

    useEffect(() => {
        if (debouncedQuery) {
            console.log("Fetching results for:", debouncedQuery);
            const fetchData = async () => {
                console.log(`API called with query: "${debouncedQuery}"`);
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

export default UseDebounceExample;
