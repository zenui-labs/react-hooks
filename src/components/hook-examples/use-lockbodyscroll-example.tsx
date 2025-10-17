import React, {useState} from "react";
import {useLockBodyScroll} from "@zenuilabs/react-hooks";
import {createPortal} from "react-dom";

const UseLockBodyScrollExample = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useLockBodyScroll(isModalOpen);

    return (
        <div className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 w-max rounded-md bg-brandColor text-white transition-all"
            >
                Open Modal
            </button>

            {isModalOpen && createPortal(
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-2xl bg-white/30 flex items-center justify-center z-[100]">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-center space-y-4">
                        <p className="text-gray-900 dark:text-white">
                            Body scroll is locked while this modal is open.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                        >
                            Close Modal
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default UseLockBodyScrollExample;