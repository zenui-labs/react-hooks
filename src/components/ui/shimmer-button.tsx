import React from 'react';

export default function ShimmerButton() {
    const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;
    return (<div className="flex items-center justify-center font-sans mb-4">
            <style>{customCss}</style>
            <a className="relative inline-flex items-center justify-center p-[1.5px] bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden group">
                <div className="absolute inset-0" style={{
                    background: 'conic-gradient(from var(--angle), transparent 25%, #3B03A9, transparent 50%)',
                    animation: 'shimmer-spin 2.5s linear infinite'
                }}/>
                <span
                    className="relative z-10 inline-flex items-center justify-center w-full h-full px-6 py-1.5 640px:py-2 dark:text-white dark:bg-gray-900 bg-white text-[0.8rem] 640px:text-[0.9rem] rounded-full">

v2.0.0 TypeScript Ready
        </span>
            </a>
        </div>
    );
}