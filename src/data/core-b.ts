import type {HookDoc} from "@/types";

export const coreBHooks: Record<string, HookDoc> = {
    usecopytoclipboard: {
        name: 'useCopyToClipboard',
        description: 'Copy text to the clipboard and get a short-lived flag for "Copied" feedback. Falls back to a hidden textarea on plain http pages and older browsers.',
        category: 'Utilities',
        level: 'basic',
        since: '1.0.0',
        signature: 'useCopyToClipboard(resetAfter?: number): { isCopied: boolean; copyToClipboard: (text: string) => Promise<boolean>; error: Error | null }',
        usage: `import {useCopyToClipboard} from '@zenuilabs/react-hooks';

const INVITE_LINK = 'https://example.com/invite/7f3k29';

export default function App() {
    const {isCopied, copyToClipboard, error} = useCopyToClipboard();

    return (
        <div>
            <p>Share this link with your team:</p>
            <code>{INVITE_LINK}</code>
            <button onClick={() => copyToClipboard(INVITE_LINK)}>
                {isCopied ? 'Copied' : 'Copy link'}
            </button>
            {error && <p role="alert">Could not copy: {error.message}</p>}
        </div>
    );
}`,
        api: [
            {
                param: 'resetAfter',
                type: 'number',
                description: 'Milliseconds before isCopied returns to false. Pass 0 to keep it true until the next copy. Defaults to 2000.'
            }
        ],
        returns: [
            {
                name: 'isCopied',
                type: 'boolean',
                description: 'True after a successful copy, until resetAfter elapses. A new copy restarts the timer.'
            },
            {
                name: 'copyToClipboard',
                type: '(text: string) => Promise<boolean>',
                description: 'Copies the text. Tries the async Clipboard API first, then a hidden textarea. Resolves to true on success.'
            },
            {
                name: 'error',
                type: 'Error | null',
                description: 'The reason the last copy failed, or null. Cleared by the next successful copy.'
            }
        ]
    },
    useinterval: {
        name: 'useInterval',
        description: 'Run a callback on a fixed interval that pauses when the delay is null. The latest callback is always called, so it can read fresh state without restarting the timer.',
        category: 'Time & Motion',
        level: 'basic',
        since: '1.0.0',
        signature: 'useInterval(callback: () => void, delay: number | null): void',
        usage: `import {useState} from 'react';
import {useInterval} from '@zenuilabs/react-hooks';

export default function App() {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(false);

    useInterval(() => setSeconds(seconds + 1), running ? 1000 : null);

    const minutes = Math.floor(seconds / 60);
    const rest = String(seconds % 60).padStart(2, '0');

    return (
        <div>
            <h1>{minutes}:{rest}</h1>
            <button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</button>
            <button onClick={() => setSeconds(0)}>Reset</button>
        </div>
    );
}`,
        api: [
            {
                param: 'callback',
                type: '() => void',
                description: 'Function to call on every tick. Changing it does not restart the timer.'
            },
            {
                param: 'delay',
                type: 'number | null',
                description: 'Milliseconds between ticks. Pass null to pause. Changing it restarts the timer.'
            }
        ],
        returns: []
    },
    usecookie: {
        name: 'useCookie',
        description: 'Read and write one browser cookie as React state. Components that use the same cookie name stay in sync.',
        category: 'Utilities',
        level: 'intermediate',
        since: '1.0.0',
        signature: "useCookie(name: string, initialValue?: string): { value: string; setValue: (value: string, options?: CookieOptions) => void; remove: (options?: Pick<CookieOptions, 'path' | 'domain'>) => void }",
        usage: `import {useCookie} from '@zenuilabs/react-hooks';

const ONE_YEAR = 60 * 60 * 24 * 365;

export default function App() {
    const {value: consent, setValue, remove} = useCookie('cookie_consent', 'unset');

    if (consent === 'unset') {
        return (
            <div role="dialog">
                <p>We use cookies to remember your preferences.</p>
                <button onClick={() => setValue('accepted', {path: '/', maxAge: ONE_YEAR, sameSite: 'Lax'})}>
                    Accept
                </button>
                <button onClick={() => setValue('declined', {path: '/', maxAge: ONE_YEAR})}>
                    Decline
                </button>
            </div>
        );
    }

    return (
        <p>
            Consent: {consent}. <button onClick={() => remove()}>Ask me again</button>
        </p>
    );
}`,
        api: [
            {param: 'name', type: 'string', description: 'Cookie name. Encoded when written, so any characters are safe.'},
            {
                param: 'initialValue',
                type: 'string',
                description: 'Value used during server rendering and when the cookie does not exist. Defaults to an empty string.'
            },
            {param: 'options.path', type: 'string', description: 'Cookie path, for example "/". Passed to setValue.'},
            {param: 'options.domain', type: 'string', description: 'Cookie domain, for example ".example.com". Passed to setValue.'},
            {param: 'options.expires', type: 'Date', description: 'Expiry date. Passed to setValue.'},
            {
                param: 'options.maxAge',
                type: 'number',
                description: 'Lifetime in seconds. 0 expires the cookie immediately. Passed to setValue.'
            },
            {param: 'options.secure', type: 'boolean', description: 'Send the cookie over HTTPS only. Passed to setValue.'},
            {
                param: 'options.sameSite',
                type: "'Strict' | 'Lax' | 'None'",
                description: 'SameSite policy. Passed to setValue.'
            }
        ],
        returns: [
            {
                name: 'value',
                type: 'string',
                description: 'Current cookie value, or initialValue when the cookie is missing. Synced before the first paint.'
            },
            {
                name: 'setValue',
                type: '(value: string, options?: CookieOptions) => void',
                description: 'Writes the cookie and updates every component using the same name.'
            },
            {
                name: 'remove',
                type: "(options?: Pick<CookieOptions, 'path' | 'domain'>) => void",
                description: 'Deletes the cookie and sets value to an empty string. Uses the path and domain from the last setValue call unless you pass them.'
            }
        ]
    },
    usegeolocation: {
        name: 'useGeolocation',
        description: 'Watch the device position with the Geolocation API. The browser asks for permission when the component mounts.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useGeolocation(options?: GeolocationOptions): GeolocationState',
        usage: `import {useGeolocation} from '@zenuilabs/react-hooks';

export default function App() {
    const {latitude, longitude, accuracy, loading, error, isSupported} = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 10000,
    });

    if (!isSupported) return <p>Your browser cannot share its location.</p>;
    if (loading) return <p>Finding your location...</p>;
    if (error) return <p>Location unavailable: {error}</p>;

    const mapUrl = 'https://www.openstreetmap.org/?mlat=' + latitude + '&mlon=' + longitude + '#map=16/' + latitude + '/' + longitude;

    return (
        <div>
            <p>
                You are at {latitude?.toFixed(5)}, {longitude?.toFixed(5)} (within {Math.round(accuracy ?? 0)} m).
            </p>
            <a href={mapUrl} target="_blank" rel="noreferrer">Open in OpenStreetMap</a>
        </div>
    );
}`,
        api: [
            {
                param: 'options.enableHighAccuracy',
                type: 'boolean',
                description: 'Ask for a GPS-quality fix. Slower and uses more battery. Defaults to false.'
            },
            {
                param: 'options.timeout',
                type: 'number',
                description: 'Milliseconds to wait for each position before reporting an error. Defaults to no limit.'
            },
            {
                param: 'options.maximumAge',
                type: 'number',
                description: 'Accept a cached position up to this many milliseconds old. Defaults to 0.'
            }
        ],
        returns: [
            {name: 'latitude', type: 'number | null', description: 'Latitude in decimal degrees, or null before the first fix.'},
            {name: 'longitude', type: 'number | null', description: 'Longitude in decimal degrees, or null before the first fix.'},
            {name: 'accuracy', type: 'number | null', description: 'Accuracy radius in meters, or null before the first fix.'},
            {name: 'timestamp', type: 'number | null', description: 'When the last position was captured, in milliseconds since the epoch.'},
            {name: 'loading', type: 'boolean', description: 'True until the first position or error arrives.'},
            {
                name: 'error',
                type: 'string | null',
                description: 'Error message, for example when permission is denied. Cleared by the next position.'
            },
            {name: 'isSupported', type: 'boolean', description: 'False when the browser has no Geolocation API.'}
        ]
    },
    usehash: {
        name: 'useHash',
        description: 'Read and update the URL hash. Useful for tabs, anchors and small bits of shareable state.',
        category: 'Browser & Device',
        level: 'basic',
        since: '1.0.0',
        signature: 'useHash(): { hash: string; setHash: (hash: string) => void }',
        usage: `import {useHash} from '@zenuilabs/react-hooks';

const TABS = ['overview', 'specs', 'reviews'];

export default function App() {
    const {hash, setHash} = useHash();
    const active = hash.slice(1) || 'overview';

    return (
        <div>
            <nav>
                {TABS.map((tab) => (
                    <button key={tab} aria-pressed={active === tab} onClick={() => setHash(tab)}>
                        {tab}
                    </button>
                ))}
            </nav>
            <section>
                <h2>{active}</h2>
                <p>Reload the page or share the link and this tab stays open.</p>
            </section>
        </div>
    );
}`,
        api: [],
        returns: [
            {
                name: 'hash',
                type: 'string',
                description: 'Current hash including the leading "#", or an empty string. Empty during server rendering.'
            },
            {
                name: 'setHash',
                type: '(hash: string) => void',
                description: 'Sets the hash. The "#" is optional. Adds a history entry, so the back button works.'
            }
        ]
    },
    useidle: {
        name: 'useIdle',
        description: 'Report when the user has not moved the mouse, typed, scrolled or touched the page for a while. Use it to pause work, dim a screen or warn before a session expires.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useIdle(timeout?: number): { isIdle: boolean; lastActive: number | null }',
        usage: `import {useEffect, useState} from 'react';
import {useIdle} from '@zenuilabs/react-hooks';

export default function App() {
    const {isIdle, lastActive} = useIdle(60000);
    const [status, setStatus] = useState('online');

    useEffect(() => {
        setStatus(isIdle ? 'away' : 'online');
    }, [isIdle]);

    return (
        <div>
            <p>Status: {status}</p>
            {isIdle && lastActive && (
                <p>Away since {new Date(lastActive).toLocaleTimeString()}</p>
            )}
        </div>
    );
}`,
        api: [
            {
                param: 'timeout',
                type: 'number',
                description: 'Milliseconds without activity before the user counts as idle. Defaults to 60000.'
            }
        ],
        returns: [
            {name: 'isIdle', type: 'boolean', description: 'True once the timeout passes with no activity. Any activity sets it back to false.'},
            {
                name: 'lastActive',
                type: 'number | null',
                description: 'Time of the last activity in milliseconds since the epoch. Updated when isIdle changes, not on every event. Null before mount.'
            }
        ]
    },
    useintersection: {
        name: 'useIntersection',
        description: 'Report whether an element is on screen using IntersectionObserver. Use it for lazy loading, reveal animations and view tracking.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useIntersection<T extends HTMLElement = HTMLElement>(options?: IntersectionOptions): { ref: RefObject<T>; isIntersecting: boolean; entry: IntersectionObserverEntry | null }',
        usage: `import {useIntersection} from '@zenuilabs/react-hooks';

function LazyImage({src, alt}: { src: string; alt: string }) {
    const {ref, isIntersecting} = useIntersection<HTMLDivElement>({rootMargin: '200px', once: true});

    return (
        <div ref={ref} style={{minHeight: 240, background: '#eee'}}>
            {isIntersecting && <img src={src} alt={alt} width={360} />}
        </div>
    );
}

export default function App() {
    return (
        <div>
            <p>Scroll down. Each image loads just before it reaches the viewport.</p>
            {[10, 20, 30, 40].map((id) => (
                <LazyImage key={id} src={'https://picsum.photos/id/' + id + '/360/240'} alt={'Photo ' + id} />
            ))}
        </div>
    );
}`,
        api: [
            {
                param: 'options.root',
                type: 'Element | Document | null',
                description: 'Scroll container to measure against. Defaults to the viewport.'
            },
            {
                param: 'options.rootMargin',
                type: 'string',
                description: 'Grows or shrinks the root box, in CSS margin syntax such as "200px 0px". Defaults to "0px".'
            },
            {
                param: 'options.threshold',
                type: 'number | number[]',
                description: 'Visible fraction (0 to 1) that triggers an update. Defaults to 0.'
            },
            {
                param: 'options.once',
                type: 'boolean',
                description: 'Stop observing after the element first becomes visible, so isIntersecting stays true. Defaults to false.'
            }
        ],
        returns: [
            {name: 'ref', type: 'RefObject<T>', description: 'Attach to the element to observe. Elements that mount later are picked up too.'},
            {name: 'isIntersecting', type: 'boolean', description: 'True while the element meets the threshold.'},
            {
                name: 'entry',
                type: 'IntersectionObserverEntry | null',
                description: 'The latest observer entry, with intersectionRatio and bounding rects. Null until the first callback.'
            }
        ]
    },
    uselocation: {
        name: 'useLocation',
        description: 'Track the pathname, query string and hash of the current URL. Updates on back and forward navigation, hash changes and history.pushState calls from client-side routers.',
        category: 'Browser & Device',
        level: 'basic',
        since: '1.0.0',
        signature: 'useLocation(): LocationState',
        usage: `import {useEffect} from 'react';
import {useLocation} from '@zenuilabs/react-hooks';

function trackPageView(path: string) {
    console.log('page_view', path);
}

export default function App() {
    const {pathname, search, hash} = useLocation();

    useEffect(() => {
        if (pathname) trackPageView(pathname + search);
    }, [pathname, search]);

    return (
        <div>
            <p>Path: {pathname}</p>
            <p>Query: {search || 'none'}</p>
            <p>Hash: {hash || 'none'}</p>
            <button onClick={() => history.pushState(null, '', '/settings?tab=profile')}>
                Go to settings
            </button>
        </div>
    );
}`,
        api: [],
        returns: [
            {name: 'pathname', type: 'string', description: 'Path of the URL, such as "/settings". Empty during server rendering.'},
            {name: 'search', type: 'string', description: 'Query string including the leading "?", or an empty string.'},
            {name: 'hash', type: 'string', description: 'Hash including the leading "#", or an empty string.'}
        ]
    },
    uselockbodyscroll: {
        name: 'useLockBodyScroll',
        description: 'Stop the page behind a modal, drawer or menu from scrolling. Nested locks are counted, and the scrollbar width is padded so the layout does not shift.',
        category: 'Events & DOM',
        level: 'basic',
        since: '1.0.0',
        signature: 'useLockBodyScroll(lock?: boolean): void',
        usage: `import {useState} from 'react';
import {useLockBodyScroll} from '@zenuilabs/react-hooks';

function Modal({onClose}: { onClose: () => void }) {
    useLockBodyScroll(true);

    return (
        <div role="dialog" style={{position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0, 0, 0, 0.4)'}}>
            <div style={{background: 'white', padding: 24}}>
                <p>The page behind this dialog cannot scroll.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default function App() {
    const [open, setOpen] = useState(false);

    return (
        <div style={{height: '200vh'}}>
            <button onClick={() => setOpen(true)}>Open dialog</button>
            {open && <Modal onClose={() => setOpen(false)} />}
        </div>
    );
}`,
        api: [
            {
                param: 'lock',
                type: 'boolean',
                description: 'Whether to lock scrolling. The original styles come back when it turns false or the component unmounts. Defaults to true.'
            }
        ],
        returns: []
    },
    usemedia: {
        name: 'useMedia',
        description: 'Track whether a CSS media query matches, such as a breakpoint, dark mode or reduced motion. Safe to use with server rendering.',
        category: 'Browser & Device',
        level: 'basic',
        since: '1.0.0',
        signature: 'useMedia(query: string, defaultState?: boolean): { matches: boolean }',
        usage: `import {useMedia} from '@zenuilabs/react-hooks';

export default function App() {
    const {matches: isDesktop} = useMedia('(min-width: 1024px)');
    const {matches: prefersDark} = useMedia('(prefers-color-scheme: dark)');
    const {matches: reduceMotion} = useMedia('(prefers-reduced-motion: reduce)');

    return (
        <div>
            <p>Layout: {isDesktop ? 'two columns' : 'one column'}</p>
            <p>Color scheme: {prefersDark ? 'dark' : 'light'}</p>
            <p>Animations: {reduceMotion ? 'off' : 'on'}</p>
        </div>
    );
}`,
        api: [
            {param: 'query', type: 'string', description: 'Any CSS media query, for example "(min-width: 768px)".'},
            {
                param: 'defaultState',
                type: 'boolean',
                description: 'Value used on the server and the first client render. The real value replaces it before paint. Defaults to false.'
            }
        ],
        returns: [
            {name: 'matches', type: 'boolean', description: 'True while the query matches. Updates when it changes.'}
        ]
    },
    usemediadevices: {
        name: 'useMediaDevices',
        description: 'List the cameras, microphones and speakers the browser can see, and refresh when one is plugged in or removed. Device labels stay empty until the page has camera or microphone permission.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useMediaDevices(): { devices: MediaDeviceInfo[]; isSupported: boolean; error: Error | null; requestPermission: (constraints?: MediaStreamConstraints) => Promise<boolean> }',
        usage: `import {useMediaDevices} from '@zenuilabs/react-hooks';

export default function App() {
    const {devices, isSupported, requestPermission} = useMediaDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const hasLabels = devices.some((device) => device.label);

    if (!isSupported) return <p>This browser cannot list media devices.</p>;

    return (
        <div>
            <label>
                Camera
                <select>
                    {cameras.map((camera, index) => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || 'Camera ' + (index + 1)}
                        </option>
                    ))}
                </select>
            </label>
            {!hasLabels && <button onClick={() => requestPermission({video: true})}>Show device names</button>}
        </div>
    );
}`,
        api: [],
        returns: [
            {
                name: 'devices',
                type: 'MediaDeviceInfo[]',
                description: 'Every input and output device. Labels are empty strings until permission is granted.'
            },
            {name: 'isSupported', type: 'boolean', description: 'False when navigator.mediaDevices is missing, for example on plain http pages.'},
            {name: 'error', type: 'Error | null', description: 'The last error from listing devices or requesting permission.'},
            {
                name: 'requestPermission',
                type: '(constraints?: MediaStreamConstraints) => Promise<boolean>',
                description: 'Asks for camera and microphone access, stops the stream right away, then refreshes the list with labels. Defaults to {audio: true, video: true}.'
            }
        ]
    },
    usemouse: {
        name: 'useMouse',
        description: 'Track the pointer position in the viewport or relative to an element. Updates at most once per animation frame.',
        category: 'Events & DOM',
        level: 'basic',
        since: '1.0.0',
        signature: 'useMouse<T extends HTMLElement = HTMLElement>(ref?: RefObject<T | null>): MousePosition',
        usage: `import {useRef} from 'react';
import {useMouse} from '@zenuilabs/react-hooks';

export default function App() {
    const ref = useRef<HTMLDivElement>(null);
    const {x, y} = useMouse(ref);

    return (
        <div ref={ref} style={{position: 'relative', height: 240, overflow: 'hidden', border: '1px solid #ccc'}}>
            <p style={{padding: 16}}>Move the pointer here: {Math.round(x)}, {Math.round(y)}</p>
            <div
                style={{
                    position: 'absolute',
                    left: x - 8,
                    top: y - 8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#2563eb',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}`,
        api: [
            {
                param: 'ref',
                type: 'RefObject<T | null>',
                description: 'Element to track. Coordinates are relative to its top-left corner and update only while the pointer is over it. Omit to track the whole window.'
            }
        ],
        returns: [
            {name: 'x', type: 'number', description: 'Horizontal position in pixels. Starts at 0.'},
            {name: 'y', type: 'number', description: 'Vertical position in pixels. Starts at 0.'}
        ]
    },
    usemousewheel: {
        name: 'useMouseWheel',
        description: 'Read the deltas of the latest wheel or trackpad scroll event, on the window or on one element. The listener is passive, so scrolling stays smooth.',
        category: 'Events & DOM',
        level: 'basic',
        since: '1.0.0',
        signature: 'useMouseWheel<T extends HTMLElement = HTMLElement>(ref?: RefObject<T | null>): MouseWheelEvent',
        usage: `import {useEffect, useRef, useState} from 'react';
import {useMouseWheel} from '@zenuilabs/react-hooks';

export default function App() {
    const ref = useRef<HTMLDivElement>(null);
    const wheel = useMouseWheel(ref);
    const [zoom, setZoom] = useState(1);

    // Each wheel event returns a new object, so this runs even when deltaY repeats.
    useEffect(() => {
        if (wheel.deltaY === 0) return;
        setZoom((z) => Math.min(4, Math.max(0.5, z - wheel.deltaY * 0.001)));
    }, [wheel]);

    return (
        <div ref={ref} style={{height: 240, overflow: 'auto', border: '1px solid #ccc'}}>
            <p>Scroll inside this box to zoom: {zoom.toFixed(2)}x</p>
            <div style={{width: 80 * zoom, height: 80 * zoom, background: '#60a5fa'}} />
        </div>
    );
}`,
        api: [
            {
                param: 'ref',
                type: 'RefObject<T | null>',
                description: 'Element to listen on. Omit to listen on the window.'
            }
        ],
        returns: [
            {name: 'deltaX', type: 'number', description: 'Horizontal scroll amount of the latest event. Positive is right.'},
            {name: 'deltaY', type: 'number', description: 'Vertical scroll amount of the latest event. Positive is down.'},
            {name: 'deltaZ', type: 'number', description: 'Depth scroll amount of the latest event. Usually 0.'}
        ]
    },
    usenetworkstate: {
        name: 'useNetworkState',
        description: 'Track whether the browser is online, when that last changed, and the connection quality where the browser reports it.',
        category: 'Browser & Device',
        level: 'basic',
        since: '1.0.0',
        signature: 'useNetworkState(): NetworkState',
        usage: `import {useNetworkState} from '@zenuilabs/react-hooks';

export default function App() {
    const {online, since, effectiveType, saveData} = useNetworkState();
    const lowQuality = saveData || effectiveType === '2g' || effectiveType === 'slow-2g';

    return (
        <div>
            {!online && (
                <p role="status">
                    You are offline since {since?.toLocaleTimeString()}. Changes will sync when you reconnect.
                </p>
            )}
            <img
                src={lowQuality ? '/hero-small.jpg' : '/hero-large.jpg'}
                alt="Product photo"
                width={480}
            />
        </div>
    );
}`,
        api: [],
        returns: [
            {name: 'online', type: 'boolean', description: 'True when the browser reports a network connection. True during server rendering.'},
            {name: 'since', type: 'Date | undefined', description: 'When online last changed, or when the hook mounted.'},
            {
                name: 'effectiveType',
                type: "'slow-2g' | '2g' | '3g' | '4g' | undefined",
                description: 'Estimated connection class. Chromium browsers only. Undefined elsewhere.'
            },
            {name: 'downlink', type: 'number | undefined', description: 'Estimated bandwidth in megabits per second. Chromium browsers only.'},
            {name: 'rtt', type: 'number | undefined', description: 'Estimated round-trip time in milliseconds. Chromium browsers only.'},
            {name: 'saveData', type: 'boolean | undefined', description: 'True when the user turned on a data saver. Chromium browsers only.'}
        ]
    },
    usepageleave: {
        name: 'usePageLeave',
        description: 'Call a function when the pointer leaves the page, for example toward the tab bar. Use it for exit-intent prompts. It does not block navigation.',
        category: 'Events & DOM',
        level: 'basic',
        since: '1.0.0',
        signature: 'usePageLeave(callback: (event?: MouseEvent) => void): void',
        usage: `import {useState} from 'react';
import {usePageLeave} from '@zenuilabs/react-hooks';

export default function App() {
    const [showOffer, setShowOffer] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    usePageLeave(() => {
        if (!dismissed) setShowOffer(true);
    });

    return (
        <div>
            <h1>Checkout</h1>
            {showOffer && (
                <div role="dialog">
                    <p>Before you go: take 10% off with code STAY10.</p>
                    <button onClick={() => { setShowOffer(false); setDismissed(true); }}>No thanks</button>
                </div>
            )}
        </div>
    );
}`,
        api: [
            {
                param: 'callback',
                type: '(event?: MouseEvent) => void',
                description: 'Called with the mouseout event each time the pointer crosses an edge of the page. The latest callback is always used.'
            }
        ],
        returns: []
    },
    usesearchparam: {
        name: 'useSearchParam',
        description: 'Read and write one query string parameter. Every component that reads the same key updates together, and back and forward navigation works.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useSearchParam(key: string): { value: string | null; setValue: (value: string | null, options?: SearchParamOptions) => void }',
        usage: `import {useSearchParam} from '@zenuilabs/react-hooks';

const PRODUCTS = ['Desk lamp', 'Office chair', 'Standing desk', 'Monitor arm', 'Desk mat'];

function SearchBox() {
    const {value, setValue} = useSearchParam('q');
    return (
        <input
            value={value ?? ''}
            placeholder="Search products"
            onChange={(e) => setValue(e.target.value || null, {replace: true})}
        />
    );
}

function Results() {
    const {value} = useSearchParam('q');
    const query = (value ?? '').toLowerCase();
    const matches = PRODUCTS.filter((name) => name.toLowerCase().includes(query));
    return <ul>{matches.map((name) => <li key={name}>{name}</li>)}</ul>;
}

export default function App() {
    return (
        <div>
            <SearchBox />
            <Results />
        </div>
    );
}`,
        api: [
            {param: 'key', type: 'string', description: 'Name of the query parameter, for example "q" for ?q=lamp.'},
            {
                param: 'options.replace',
                type: 'boolean',
                description: 'Passed to setValue. Replace the current history entry instead of adding one. Use it for values that change on every keystroke. Defaults to false.'
            }
        ],
        returns: [
            {
                name: 'value',
                type: 'string | null',
                description: 'Current value, or null when the parameter is absent. Null during server rendering.'
            },
            {
                name: 'setValue',
                type: '(value: string | null, options?: SearchParamOptions) => void',
                description: 'Sets the parameter, or removes it when passed null, and updates every component using the same key.'
            }
        ]
    },
    usevisibilitychange: {
        name: 'useVisibilityChange',
        description: 'Track whether the page is visible or hidden in a background tab. Use it to pause video, polling or animations the user cannot see.',
        category: 'Browser & Device',
        level: 'basic',
        since: '1.0.0',
        signature: 'useVisibilityChange(): VisibilityState',
        usage: `import {useEffect, useState} from 'react';
import {useVisibilityChange} from '@zenuilabs/react-hooks';

export default function App() {
    const {visible} = useVisibilityChange();
    const [prices, setPrices] = useState<number[]>([]);

    useEffect(() => {
        if (!visible) return;
        const id = setInterval(() => {
            setPrices((list) => [Math.round(100 + Math.random() * 10), ...list].slice(0, 5));
        }, 2000);
        return () => clearInterval(id);
    }, [visible]);

    return (
        <div>
            <p>Polling is {visible ? 'running' : 'paused while the tab is hidden'}.</p>
            <ul>{prices.map((price, i) => <li key={i}>{price}</li>)}</ul>
        </div>
    );
}`,
        api: [],
        returns: [
            {name: 'visible', type: 'boolean', description: 'True while the page is visible. True during server rendering.'},
            {name: 'hidden', type: 'boolean', description: 'The opposite of visible.'}
        ]
    },
    usevideo: {
        name: 'useVideo',
        description: 'Control a video and track its playback state. Attach videoRef to a video element to show it, or leave it unattached to control a hidden one.',
        category: 'Media',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useVideo(src: string): VideoState & { videoRef: RefObject<HTMLVideoElement>; controls: VideoControls }',
        usage: `import {useVideo} from '@zenuilabs/react-hooks';

const SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

export default function App() {
    const {videoRef, playing, currentTime, duration, muted, controls} = useVideo(SRC);

    return (
        <div>
            <video ref={videoRef} width={480} playsInline />
            <div>
                <button onClick={playing ? controls.pause : controls.play}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={controls.stop}>Stop</button>
                <button onClick={controls.toggleMute}>{muted ? 'Unmute' : 'Mute'}</button>
                <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => controls.setTime(Number(e.target.value))}
                />
                <span>{currentTime.toFixed(1)} / {duration.toFixed(1)} s</span>
            </div>
        </div>
    );
}`,
        api: [
            {param: 'src', type: 'string', description: 'Video URL. Changing it loads the new source.'}
        ],
        returns: [
            {
                name: 'videoRef',
                type: 'RefObject<HTMLVideoElement>',
                description: 'Attach to a <video> element. If you do not, the hook creates a hidden one on the client. Null during server rendering.'
            },
            {name: 'playing', type: 'boolean', description: 'True while the video is playing.'},
            {name: 'currentTime', type: 'number', description: 'Playback position in seconds.'},
            {name: 'duration', type: 'number', description: 'Length in seconds, or 0 until the metadata loads.'},
            {name: 'volume', type: 'number', description: 'Volume from 0 to 1.'},
            {name: 'muted', type: 'boolean', description: 'True while the video is muted.'},
            {name: 'ended', type: 'boolean', description: 'True when playback reached the end.'},
            {
                name: 'controls.play',
                type: '() => Promise<void>',
                description: 'Starts playback. Rejects if the browser blocks it, for example autoplay with sound.'
            },
            {name: 'controls.pause', type: '() => void', description: 'Pauses playback.'},
            {name: 'controls.stop', type: '() => void', description: 'Pauses and rewinds to the start.'},
            {name: 'controls.setVolume', type: '(volume: number) => void', description: 'Sets the volume, clamped between 0 and 1.'},
            {name: 'controls.setTime', type: '(time: number) => void', description: 'Seeks to a time in seconds, clamped to the duration.'},
            {name: 'controls.toggleMute', type: '() => void', description: 'Mutes or unmutes the video.'}
        ]
    },
    useaudio: {
        name: 'useAudio',
        description: 'Play a sound and track its playback state without rendering an audio element. Use it for notification sounds, previews and simple players.',
        category: 'Media',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useAudio(src: string): AudioState & { audioRef: RefObject<HTMLAudioElement>; controls: AudioControls }',
        usage: `import {useAudio} from '@zenuilabs/react-hooks';

const TRACK = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';

export default function App() {
    const {playing, currentTime, duration, volume, controls} = useAudio(TRACK);

    return (
        <div>
            <p>T-rex roar: {currentTime.toFixed(1)} / {duration.toFixed(1)} s</p>
            <button onClick={playing ? controls.pause : controls.play}>{playing ? 'Pause' : 'Play'}</button>
            <button onClick={controls.stop}>Stop</button>
            <label>
                Volume
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => controls.setVolume(Number(e.target.value))}
                />
            </label>
        </div>
    );
}`,
        api: [
            {param: 'src', type: 'string', description: 'Audio URL. Changing it loads the new source.'}
        ],
        returns: [
            {
                name: 'audioRef',
                type: 'RefObject<HTMLAudioElement>',
                description: 'The audio element the hook controls. You can attach it to an <audio> element instead. Null during server rendering.'
            },
            {name: 'playing', type: 'boolean', description: 'True while audio is playing.'},
            {name: 'currentTime', type: 'number', description: 'Playback position in seconds.'},
            {name: 'duration', type: 'number', description: 'Length in seconds, or 0 until the metadata loads.'},
            {name: 'volume', type: 'number', description: 'Volume from 0 to 1.'},
            {name: 'muted', type: 'boolean', description: 'True while audio is muted.'},
            {name: 'ended', type: 'boolean', description: 'True when playback reached the end.'},
            {
                name: 'controls.play',
                type: '() => Promise<void>',
                description: 'Starts playback. Browsers require a user gesture first, so call it from a click handler.'
            },
            {name: 'controls.pause', type: '() => void', description: 'Pauses playback.'},
            {name: 'controls.stop', type: '() => void', description: 'Pauses and rewinds to the start.'},
            {name: 'controls.setVolume', type: '(volume: number) => void', description: 'Sets the volume, clamped between 0 and 1.'},
            {name: 'controls.setTime', type: '(time: number) => void', description: 'Seeks to a time in seconds, clamped to the duration.'},
            {name: 'controls.toggleMute', type: '() => void', description: 'Mutes or unmutes the audio.'}
        ]
    },
    usefullscreen: {
        name: 'useFullscreen',
        description: 'Show one element in fullscreen mode and track whether it is there. Works with the prefixed API in older Safari.',
        category: 'Media',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useFullscreen<T extends HTMLElement = HTMLElement>(): { ref: RefObject<T | null>; isFullscreen: boolean; isSupported: boolean; controls: FullscreenControls }',
        usage: `import {useFullscreen} from '@zenuilabs/react-hooks';

export default function App() {
    const {ref, isFullscreen, isSupported, controls} = useFullscreen<HTMLDivElement>();

    return (
        <div
            ref={ref}
            style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: 240,
                background: isFullscreen ? '#111' : '#f4f4f5',
                color: isFullscreen ? '#fff' : '#111',
            }}
        >
            <h2>Quarterly results</h2>
            <button onClick={controls.toggle} disabled={!isSupported}>
                {isFullscreen ? 'Exit presentation' : 'Present'}
            </button>
        </div>
    );
}`,
        api: [],
        returns: [
            {name: 'ref', type: 'RefObject<T | null>', description: 'Attach to the element that should go fullscreen.'},
            {name: 'isFullscreen', type: 'boolean', description: 'True while this element is the fullscreen element.'},
            {
                name: 'isSupported',
                type: 'boolean',
                description: 'False when the browser or embedding iframe does not allow fullscreen, as on iPhone Safari.'
            },
            {
                name: 'controls.enter',
                type: '() => void',
                description: 'Requests fullscreen for the element. Must run from a user gesture such as a click.'
            },
            {name: 'controls.exit', type: '() => void', description: 'Leaves fullscreen if any element is fullscreen.'},
            {
                name: 'controls.toggle',
                type: '() => void',
                description: 'Enters or exits, based on the live document state rather than the last render.'
            }
        ]
    }
};
