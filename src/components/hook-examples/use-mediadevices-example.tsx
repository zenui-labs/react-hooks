import React from "react";
import {useMediaDevices} from "@zenuilabs/react-hooks";

const UseMediaDevicesExample = () => {
    const {devices} = useMediaDevices();

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Media Devices
            </h2>

            {devices.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No media devices found.</p>
            ) : (
                <ul className="space-y-2 text-gray-800 max-w-md dark:text-gray-200 w-full">
                    {devices.map((device) => (
                        <li key={device.deviceId}
                            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md">
                            <span
                                className="font-semibold">{device.kind.replace("input", "Input").replace("output", "Output")}:</span> {device.label || "Unknown Device"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UseMediaDevicesExample;