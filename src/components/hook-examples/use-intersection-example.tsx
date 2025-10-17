import React from "react";
import {useIntersection} from "@zenuilabs/react-hooks";

const UseIntersectionExample = () => {
    const {ref, isIntersecting} = useIntersection<HTMLDivElement>({threshold: 0.5});

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <p className="text-gray-700 dark:text-gray-300">
                The box below is {isIntersecting ? "visible" : "not visible"} in the viewport.
            </p>

            <div
                className="h-80 w-full overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                <div style={{height: "600px"}} className="relative">
                    <div
                        ref={ref}
                        className={`w-full h-32 rounded-md flex items-center justify-center text-white font-bold transition-all ${isIntersecting ? "bg-green-500" : "bg-gray-400"}`}
                    >
                        {isIntersecting ? "Visible" : "Not Visible"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseIntersectionExample;