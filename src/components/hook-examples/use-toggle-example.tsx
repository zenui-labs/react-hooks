import React from "react";
import {useToggle} from "@zenuilabs/react-hooks";
import {Moon, Sun} from "lucide-react";

const UseToggleExample = () => {
    const {value, toggle, setTrue, setFalse} = useToggle(false);

    return (
        <div className="p-8 rounded-xl bg-gray-50 dark:bg-gray-900">
            <div
                className={`flex items-center w-max gap-2 mb-5 px-4 py-2 rounded-lg text-white transition-colors ${
                    value ? "bg-gray-800" : "bg-yellow-400"
                }`}
            >
                {value ? <Moon size={18}/> : <Sun size={18}/>}
                <span>{value ? "Dark Mode" : "Light Mode"}</span>
            </div>

            <button
                onClick={toggle}
                className="px-4 py-2 bg-brandColor active:scale-[0.95] transition-transform duration-100 hover:bg-brandColor/80 cursor-pointer text-white rounded-lg text-sm font-medium"
            >
                Toggle
            </button>

            <button
                onClick={setTrue}
                disabled={value}
                className="px-4 disabled:cursor-not-allowed disabled:bg-gray-100 ml-3 py-2 border border-gray-200 cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:disabled:bg-gray-800 dark:text-darkText rounded-lg text-sm font-medium"
            >
                Set true
            </button>

            <button
                onClick={setFalse}
                disabled={!value}
                className="px-4 ml-3 disabled:cursor-not-allowed disabled:bg-gray-100 py-2 border border-gray-200 cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:disabled:bg-gray-800 dark:text-darkText rounded-lg text-sm font-medium"
            >
                Set false
            </button>
        </div>
    );
};

export default UseToggleExample;
