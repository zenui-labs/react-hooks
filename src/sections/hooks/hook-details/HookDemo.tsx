import React from 'react';
import UseToggleExample from "@/components/hook-examples/use-toggle-example";
import UseLocalStorageExample from "@/components/hook-examples/use-local-storage-example";
import UseSessionStorageExample from "@/components/hook-examples/use-session-storage";
import UseCounterExample from "@/components/hook-examples/use-counter-example";
import UsePreviousExample from "@/components/hook-examples/use-previous-example";
import UseUpdateExample from "@/components/hook-examples/use-update-example";
import UseDebounceExample from "@/components/hook-examples/use-debounce-example";
import UseThrottleExample from "@/components/hook-examples/use-throttle-example";
import UseFetchExample from "@/components/hook-examples/use-fetch-example";
import UseAsyncExample from "@/components/hook-examples/use-async-example";
import UseHoverExample from "@/components/hook-examples/use-hover-example";
import UseClickoutsideExample from "@/components/hook-examples/use-clickoutside-example";
import UseWindowsizeExample from "@/components/hook-examples/use-windowsize-example";
import UseKeypressExample from "@/components/hook-examples/use-keypress-example";
import UseLongpressExample from "@/components/hook-examples/use-longpress-example";
import UseScrollExample from "@/components/hook-examples/use-scroll-example";

const hookComponents: Record<string, React.FC> = {
    usetoggle: UseToggleExample,
    uselocalstorage: UseLocalStorageExample,
    usesessionstorage: UseSessionStorageExample,
    usecounter: UseCounterExample,
    useprevious: UsePreviousExample,
    useupdate: UseUpdateExample,
    usedebounce: UseDebounceExample,
    usethrottle: UseThrottleExample,
    usefetch: UseFetchExample,
    useasync: UseAsyncExample,
    usehover: UseHoverExample,
    useclickoutside: UseClickoutsideExample,
    usewindowsize: UseWindowsizeExample,
    usekeypress: UseKeypressExample,
    uselongpress: UseLongpressExample,
    usescroll: UseScrollExample
};

interface HookRendererProps {
    hookName: string;
}

export const HookRenderer: React.FC<HookRendererProps> = ({hookName}) => {
    const normalizedHookName = hookName?.toLowerCase().replace(/[^a-z]/g, '');
    const HookComponent = hookComponents[normalizedHookName];

    if (!HookComponent) {
        return (
            <div className="p-4 rounded-lg text-center">
                <p className="text-gray-500">Hook &#34;{hookName}&#34; not found</p>
                <p className="text-sm text-gray-400 mt-1">
                    Available hooks: {Object.keys(hookComponents).join(', ')}
                </p>
            </div>
        );
    }

    return <HookComponent/>;
};
