'use client'

import React, {useEffect} from "react";
import {useLocalStorage} from "@zenuilabs/react-hooks";

const UseLocalStorageExample = () => {
    const currentTheme = (localStorage.getItem("rh-theme") as "light" | "dark") ?? "light";
    const {storedValue, setValue} = useLocalStorage<"light" | "dark">("rh-theme", currentTheme);

    const toggleTheme = () => {
        setValue(storedValue === "light" ? "dark" : "light");
    };

    useEffect(() => {
        if (storedValue === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [storedValue]);

    return (
        <div
            className={`rounded-xl p-8 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white`}
        >
            <h2 className="text-xl font-semibold mb-4">useLocalStorage Demo</h2>
            <p className="mb-4">Current theme: <strong>{storedValue}</strong></p>
            <button
                onClick={toggleTheme}
                className="rounded-lg px-4 cursor-pointer py-2 font-medium transition-colors shadow-sm
          bg-brandColor text-white hover:bg-brandColor/80"
            >
                Toggle Theme
            </button>
        </div>
    );
};

export default UseLocalStorageExample;
