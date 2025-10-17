import React, {useState} from "react";
import {useSearchParam} from "@zenuilabs/react-hooks";

const UseSearchParamExample = () => {
    const {value: searchValue, setValue: setSearchValue} = useSearchParam("query");
    const [input, setInput] = useState(searchValue || "");

    const handleUpdate = () => {
        setSearchValue(input || null);
    };

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a search query..."
                className="w-full p-3 max-w-md rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-accent"
            />

            <button
                onClick={handleUpdate}
                className="px-4 py-2 w-max rounded-md bg-brandColor text-white transition-all"
            >
                Update Search Param
            </button>

            <p className="text-gray-700 dark:text-gray-300">
                Current search parameter: <span className="font-semibold">{searchValue || "None"}</span>
            </p>
        </div>
    );
};

export default UseSearchParamExample;