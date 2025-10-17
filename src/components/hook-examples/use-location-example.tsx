import React from "react";
import {useLocation} from "@zenuilabs/react-hooks";

const UseLocationExample = () => {
    const {pathname, search, hash} = useLocation();

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Current Location Tracker
            </h2>

            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><span className="font-semibold">Pathname:</span> {pathname}</p>
                <p><span className="font-semibold">Search:</span> {search || "None"}</p>
                <p><span className="font-semibold">Hash:</span> {hash || "None"}</p>
            </div>
        </div>
    );
};

export default UseLocationExample;