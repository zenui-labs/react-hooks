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
import UseDropExample from "@/components/hook-examples/use-drop-example";
import UseDropareaExample from "@/components/hook-examples/use-droparea-example";
import UseEventExample from "@/components/hook-examples/use-event-example";
import UseCopyToClipboardExample from "@/components/hook-examples/use-copytoclipboard-example";
import UseIntervalExample from "@/components/hook-examples/use-interval-example";
import UseCookieExample from "@/components/hook-examples/use-cookie-example";
import UseGeolocationExample from "@/components/hook-examples/use-geolocation-example";
import UseHashExample from "@/components/hook-examples/use-hash-example";
import UseIdleExample from "@/components/hook-examples/use-idle-example";
import UseIntersectionExample from "@/components/hook-examples/use-intersection-example";
import UseLocationExample from "@/components/hook-examples/use-location-example";
import UseLockBodyScrollExample from "@/components/hook-examples/use-lockbodyscroll-example";
import UseMediaExample from "@/components/hook-examples/use-media-example";
import UseMediaDevicesExample from "@/components/hook-examples/use-mediadevices-example";
import UseMouseExample from "@/components/hook-examples/use-mouse-example";
import UseMouseWheelExample from "@/components/hook-examples/use-mousewheel-example";
import UseNetworkStateExample from "@/components/hook-examples/use-networkstate-example";
import UsePageLeaveExample from "@/components/hook-examples/use-pageleave-example";
import UseSearchparamExample from "@/components/hook-examples/use-searchparam-example";
import UseVisibilityChangeExample from "@/components/hook-examples/use-visibilitychange-example";
import UseVideoExample from "@/components/hook-examples/use-video-example";
import UseAudioExample from "@/components/hook-examples/use-audio-example";
import UseFullscreenExample from "@/components/hook-examples/use-fullscreen-example";

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
    usescroll: UseScrollExample,
    usedrop: UseDropExample,
    usedroparea: UseDropareaExample,
    useevent: UseEventExample,
    usecopytoclipboard: UseCopyToClipboardExample,
    useinterval: UseIntervalExample,
    usecookie: UseCookieExample,
    usegeolocation: UseGeolocationExample,
    usehash: UseHashExample,
    useidle: UseIdleExample,
    useintersection: UseIntersectionExample,
    uselocation: UseLocationExample,
    uselockbodyscroll: UseLockBodyScrollExample,
    usemedia: UseMediaExample,
    usemediadevices: UseMediaDevicesExample,
    usemouse: UseMouseExample,
    usemousewheel: UseMouseWheelExample,
    usenetworkstate: UseNetworkStateExample,
    usepageleave: UsePageLeaveExample,
    usesearchparam: UseSearchparamExample,
    usevisibilitychange: UseVisibilityChangeExample,
    usevideo: UseVideoExample,
    useaudio: UseAudioExample,
    usefullscreen: UseFullscreenExample,
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
