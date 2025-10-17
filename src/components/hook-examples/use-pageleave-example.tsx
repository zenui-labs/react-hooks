import React, {useState} from "react";
import {usePageLeave} from "@zenuilabs/react-hooks";

const UsePageLeaveExample = () => {
    const [message, setMessage] = useState("Try refreshing or closing the page!");

    usePageLeave((event) => {
        // Optional: Custom logic before leaving
        console.log("Page leave detected!");
        setMessage("You attempted to leave the page!");
        // Default browser confirmation
        event && (event.returnValue = "Are you sure you want to leave?");
    });

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
    );
};

export default UsePageLeaveExample;