'use client'

import React from "react";
import {useKeyPress} from "@zenuilabs/react-hooks";

const KeyPressCard = () => {
    const isEnterPressed = useKeyPress("Enter");

    return (
        <div className="flex justify-center dark:text-darkText flex-col rounded-xl p-16 bg-gray-100 dark:bg-gray-900">
            <p>
                Press the <strong>Enter</strong> key to see the state update:
            </p>
            <p className="mt-2 text-lg font-medium">
                Status:{" "}
                <span className={isEnterPressed ? "text-green-500" : "text-red-500"}>
                        {isEnterPressed ? "Pressed" : "Released"}
                    </span>
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Works with any keyboard key. Just change the key passed to useKeyPress.
            </p>
        </div>
    );
};

export default KeyPressCard;
