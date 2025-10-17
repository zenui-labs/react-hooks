import React from "react";
import {useDropArea} from "@zenuilabs/react-hooks";

const UseDropAreaExample = () => {
    const {ref, isOver, files, handlers} = useDropArea<HTMLDivElement>();

    return (
        <div className="flex flex-col p-16 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            {/* Info Panel */}
            <div
                className="rounded-xl p-6 shadow-lg transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md">
                <p>Status: <strong>{isOver ? "Dragging Files..." : "Idle"}</strong></p>
                <p>Total Files: <strong>{files.length}</strong></p>
                {files.length > 0 && (
                    <ul className="mt-3 list-disc list-inside space-y-1 text-sm">
                        {files.map((file, i) => (
                            <li key={i}>
                                {file.name} <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Drop Zone */}
            <div
                ref={ref}
                {...handlers}
                className={`h-64 w-full max-w-md flex items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer ${isOver ? "border-green-500 bg-green-100 dark:bg-green-900/40" : "border-gray-200 dark:border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"}`}
            >
                <p className="text-gray-600 dark:text-gray-300 text-center px-4">
                    Drag & drop files here
                </p>
            </div>
        </div>
    );
};

export default UseDropAreaExample;