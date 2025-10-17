import React, {useState} from "react";
import {useCopyToClipboard} from "@zenuilabs/react-hooks";
import {Check, Copy} from "lucide-react";

const UseCopyToClipboardExample = () => {
    const {isCopied, copyToClipboard} = useCopyToClipboard();
    const [text, setText] = useState("Hello from ZenUI Hooks! 🚀");

    return (
        <div className="flex flex-col p-10 justify-center bg-gray-100 dark:bg-gray-900 rounded-xl space-y-4">
            {/* Info Panel */}
            <div
                className="rounded-xl p-6 transition-colors bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full max-w-md space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type or modify text below, then click “Copy” to copy it to your clipboard.
                </p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 outline-none focus:ring-2 focus:ring-brandColor"
                    rows={3}
                />

                <button
                    onClick={() => copyToClipboard(text)}
                    className="inline-flex items-center justify-center space-x-2 rounded-md bg-brandColor text-white px-4 py-2 transition-all"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-4 h-4"/> <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4"/> <span>Copy Text</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UseCopyToClipboardExample;