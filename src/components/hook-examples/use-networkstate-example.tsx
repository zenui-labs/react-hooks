import React from "react";
import {useNetworkState} from "@zenuilabs/react-hooks";

const UseNetworkStateExample = () => {
    const {online, since} = useNetworkState();

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Network Status
            </h2>

            <p className={`text-lg font-medium ${online ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {online ? "Online" : "Offline"}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
                {since ? `Status changed at: ${since.toLocaleTimeString()}` : "Initializing..."}
            </p>
        </div>
    );
};

export default UseNetworkStateExample;