'use client'

import React, {useRef, useState} from "react";
import {useClickOutside} from "@zenuilabs/react-hooks";

const ClickOutsideDropdown = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    useClickOutside(ref, () => setIsOpen(false));

    return (
        <div className="flex flex-col rounded-xl justify-center p-16 bg-gray-100 dark:bg-gray-900">
            <div
                className="relative w-max text-gray-900 dark:text-white">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 rounded-md bg-brandColor text-white hover:bg-brandColor/90 transition-colors"
                >
                    {isOpen ? "Close Dropdown" : "Open Dropdown"}
                </button>

                {isOpen && (
                    <div
                        ref={ref}
                        className="absolute top-full mt-2 w-64 p-4 rounded-md shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <p>This dropdown closes when you click outside of it.</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Try clicking anywhere else on the page.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClickOutsideDropdown;
