import React, {useRef} from "react";
import {useMouse} from "@zenuilabs/react-hooks";

const UseMouseExample = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const {x, y} = useMouse(boxRef);

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <div
                ref={boxRef}
                className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center"
            >
                <div
                    className="absolute w-6 h-6 bg-accent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{left: x, top: y}}
                ></div>
                <p className="text-gray-900 dark:text-white font-medium z-10">
                    X: {x}px, Y: {y}px
                </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                Move your mouse inside the box to track coordinates relative to it.
            </p>
        </div>
    );
};

export default UseMouseExample;