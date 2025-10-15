'use client'

import React, {useRef} from "react";
import {useScroll} from "@zenuilabs/react-hooks";

const UseScrollExample = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {x, y, direction} = useScroll(containerRef);

    return (
        <div
            className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            <div
                className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md">
                <p>Scroll X: <strong>{x}px</strong></p>
                <p>Scroll Y: <strong>{y}px</strong></p>
                <p>Direction: <strong>{direction ?? "none"}</strong></p>
            </div>

            <div
                ref={containerRef}
                className="h-64 w-full max-w-md overflow-auto rounded-lg bg-gray-100 dark:bg-gray-800"
            >
                <div
                    className="h-[1200px] w-full bg-gradient-to-b dark:from-blue-700 dark:to-blue-900 from-blue-200 to-blue-500"></div>
            </div>
        </div>
    );
};

export default UseScrollExample;
