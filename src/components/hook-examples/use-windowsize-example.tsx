'use client'

import React from "react";
import {useWindowSize} from "@zenuilabs/react-hooks";

const WindowSizeCard = () => {
    const {width, height} = useWindowSize();

    return (
        <div className="flex justify-center p-16 rounded-xl flex-col dark:text-darkText bg-gray-100 dark:bg-gray-900">
            <p className="mb-2">
                <strong>Width:</strong> {width}px
            </p>
            <p>
                <strong>Height:</strong> {height}px
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
                Resize the window to see these values update in real-time.
            </p>
        </div>
    );
};

export default WindowSizeCard;
