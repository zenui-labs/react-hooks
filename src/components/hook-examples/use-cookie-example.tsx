import React, {useState} from "react";
import {useCookie} from "@zenuilabs/react-hooks";

const UseCookieExample = () => {
    const {value: username, setValue: setUsernameCookie, remove: removeUsernameCookie} = useCookie("username", "Guest");
    const [inputValue, setInputValue] = useState(username);

    const handleSave = () => {
        setUsernameCookie(inputValue, {
            path: "/",
            maxAge: 3600, // 1 hour
            sameSite: "Lax"
        });
    };

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <div className="max-w-md space-y-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-brandColor"
                    placeholder="Enter your name"
                />

                <div className="flex space-x-3">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md bg-brandColor hover:bg-accent-dark text-white transition-all"
                    >
                        Save Cookie
                    </button>

                    <button
                        onClick={removeUsernameCookie}
                        className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Current Cookie:</span> {username || "No cookie set"}
            </p>
        </div>
    );
};

export default UseCookieExample;