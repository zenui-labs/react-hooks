'use client'

import React from "react";
import {useHover} from "@zenuilabs/react-hooks";

const UseHoverExample = () => {
    const {ref, isHovered} = useHover<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className={`rounded-xl p-8 transition-colors
                ${isHovered ? 'bg-brandColor text-white' : 'bg-gray-50 !text-gray-900'}
                dark:${isHovered ? 'bg-brandColor text-white' : 'bg-gray-900 text-white'}
            `}
        >
            <h2 className="text-xl font-semibold mb-4">
                {isHovered ? "You're hovering!" : "Hover over this card"}
            </h2>
            <p className="mb-4">
                {isHovered
                    ? "The card changes color and text when hovered."
                    : "Move your mouse over the card to see the hover effect."}
            </p>
            <button
                className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-colors
                    ${isHovered ? 'bg-white text-brandColor hover:bg-gray-100' : 'bg-brandColor text-white hover:bg-brandColor'}
                `}
            >
                {isHovered ? "Hovered!" : "Hover me"}
            </button>
        </div>
    );
};

export default UseHoverExample;
