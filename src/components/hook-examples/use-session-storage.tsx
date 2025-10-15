import React, {useEffect} from "react";
import {useSessionStorage} from "@zenuilabs/react-hooks";

const UseSessionStorageExample = () => {
    const {value, setValue} = useSessionStorage<number>("session-visits", 0);

    useEffect(() => {
        setValue(value + 1);
    }, []);

    return (
        <div
            className="rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
            <h2 className="text-lg font-semibold mb-2">Session Visit Counter</h2>
            <p className="dark:text-darkText/70 mb-7">
                You have visited this page <strong
                className='dark:text-darkText'>{value}</strong> {value === 1 ? "time" : "times"} this session.
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

export default UseSessionStorageExample;
