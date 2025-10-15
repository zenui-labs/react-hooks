import React, { useState, useEffect } from "react";
import { useThrottle } from "@zenuilabs/react-hooks";

const UseThrottleExample = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const throttledPosition = useThrottle(position, 300);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div className="h-[50vh] flex flex-col justify-center pl-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <h2 className="text-lg font-semibold mb-4">Throttled Mouse Tracker</h2>

            <div className="bg-gray-100 w-max dark:bg-gray-800 p-6 rounded-xl shadow-inner">
                <p className="text-sm mb-2">
                    <strong>Live Position:</strong> X: {position.x}, Y: {position.y}
                </p>
                <p className="text-sm">
                    <strong>Throttled Position:</strong> X: {throttledPosition.x}, Y: {throttledPosition.y}
                </p>
            </div>

            <p className="mt-6 text-sm text-gray-400">
                Throttled updates occur every <strong>300ms</strong> for smoother performance.
            </p>
        </div>
    );
};

export default UseThrottleExample;
