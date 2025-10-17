import React from "react";
import {useMedia} from "@zenuilabs/react-hooks";

const UseMediaExample = () => {
    const {matches: isMobile} = useMedia("(max-width: 768px)");

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <p className="text-gray-700 dark:text-gray-300">
                Current viewport: <span className="font-semibold">{isMobile ? "Mobile" : "Desktop"}</span>
            </p>

            <div
                className={`w-full h-40 rounded-lg flex items-center justify-center font-bold text-white transition-all ${isMobile ? "bg-blue-500" : "bg-green-500"}`}
            >
                {isMobile ? "Mobile Layout" : "Desktop Layout"}
            </div>
        </div>
    );
};

export default UseMediaExample;