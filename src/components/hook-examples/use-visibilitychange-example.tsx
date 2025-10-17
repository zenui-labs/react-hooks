import React from "react";
import {useVisibilityChange} from "@zenuilabs/react-hooks";

const UseVisibilityChangeExample = () => {
    const {visible, hidden} = useVisibilityChange();

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <p className={`text-lg font-medium ${visible ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {visible ? "Page is Visible" : "Page is Hidden"}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
                Hidden: <span className="font-semibold">{hidden ? "Yes" : "No"}</span>
            </p>
        </div>
    );
};

export default UseVisibilityChangeExample;