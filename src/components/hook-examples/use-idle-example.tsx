import React, {useState} from "react";
import {useIdle} from "@zenuilabs/react-hooks";

const UseIdleExample = () => {
    const {isIdle} = useIdle(10000); // 10 seconds timeout
    const [lastActiveTime, setLastActiveTime] = useState(new Date().toLocaleTimeString());

    // Update last active time when user is active
    React.useEffect(() => {
        if (!isIdle) {
            setLastActiveTime(new Date().toLocaleTimeString());
        }
    }, [isIdle]);

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                User Idle Detection
            </h2>

            <p className="text-gray-700 dark:text-gray-300">
                Status: <span className="font-semibold">{isIdle ? "Idle" : "Active"}</span>
            </p>

            {!isIdle && (
                <p className="text-gray-600 dark:text-gray-400">
                    Last Active At: {lastActiveTime}
                </p>
            )}

            {isIdle && (
                <p className="text-red-500 dark:text-red-400">
                    You have been idle for 10 seconds!
                </p>
            )}
        </div>
    );
};

export default UseIdleExample;