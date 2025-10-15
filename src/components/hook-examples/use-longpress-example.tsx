'use client'

import React, {useState} from "react";
import {useLongPress} from "@zenuilabs/react-hooks";

const LongPressCard = () => {
    const [count, setCount] = useState(0);

    const onLongPress = () => {
        setCount(prev => prev + 1);
    };

    const bind = useLongPress(onLongPress, {
        delay: 1000,
        onStart: () => console.log("Press started"),
        onEnd: () => console.log("Press ended"),
    });

    return (
        <div className="flex p-16 rounded-xl bg-gray-100 dark:bg-gray-900">
            <div
                {...bind}
                className="rounded-xl p-8 shadow-lg h-max transition-colors cursor-pointer select-none
                    bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white text-center"
            >
                <p className="mb-4">Press and hold this card for 1 second to increase the counter.</p>
                <p className="text-lg font-medium">Count: {count}</p>
            </div>
        </div>
    );
};

export default LongPressCard;
