import React from "react";
import {useFullscreen} from "@zenuilabs/react-hooks";

const UseFullscreenExample = () => {
    const {ref, isFullscreen, controls} = useFullscreen<HTMLDivElement>();

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <div
                ref={ref}
                className="w-full h-48 bg-blue-500 dark:bg-blue-700 rounded-lg flex items-center justify-center text-white text-lg font-semibold"
            >
                {isFullscreen ? "Fullscreen Mode" : "Click buttons to enter fullscreen"}
            </div>

            <div className="flex space-x-2">
                <button onClick={controls.enter}
                        className="px-4 py-2 bg-brandColor text-white rounded-md">Enter Fullscreen
                </button>
                <button onClick={controls.exit}
                        className="px-4 py-2 bg-brandColor text-white rounded-md">Exit Fullscreen
                </button>
                <button onClick={controls.toggle}
                        className="px-4 py-2 bg-brandColor text-white rounded-md">Toggle Fullscreen
                </button>
            </div>
        </div>
    );
};

export default UseFullscreenExample;