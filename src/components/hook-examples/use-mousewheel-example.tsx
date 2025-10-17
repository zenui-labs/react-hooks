import React, {useRef} from "react";
import {useMouseWheel} from "@zenuilabs/react-hooks";

const UseMouseWheelExample = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {deltaX, deltaY, deltaZ} = useMouseWheel(containerRef);

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <div
                ref={containerRef}
                className="h-64 w-full overflow-auto rounded-lg bg-gray-50 dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700"
            >
                <div style={{height: '1200px', width: '100%'}}
                     className="bg-gradient-to-b from-blue-200 to-blue-500 dark:from-blue-700 dark:to-blue-900"></div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                deltaX: <span className="font-semibold">{deltaX}</span> px
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                deltaY: <span className="font-semibold">{deltaY}</span> px
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                deltaZ: <span className="font-semibold">{deltaZ}</span> px
            </p>
        </div>
    );
};

export default UseMouseWheelExample;