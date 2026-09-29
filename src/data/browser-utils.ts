import type {HookDoc} from "@/types";

export const browserUtilsHooks: Record<string, HookDoc> = {
    usepermission: {
        name: 'usePermission',
        description: 'Tracks the live state of a browser permission such as camera, microphone or geolocation. Use it to explain a blocked feature before asking for access.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '2.1.0',
        signature: "usePermission(name: PermissionQueryName): 'granted' | 'denied' | 'prompt' | 'unsupported'",
        usage: `import {usePermission} from '@zenuilabs/react-hooks';

export default function App() {
  const location = usePermission('geolocation');

  const findStores = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log('Nearest stores for', pos.coords.latitude, pos.coords.longitude);
    });
  };

  if (location === 'unsupported') {
    return <p>Enter your postcode to find a store.</p>;
  }

  if (location === 'denied') {
    return (
      <p>
        Location is blocked for this site. Allow it in your browser settings,
        or enter your postcode instead.
      </p>
    );
  }

  return (
    <button onClick={findStores}>
      {location === 'granted' ? 'Show stores near me' : 'Use my location'}
    </button>
  );
}`,
        api: [
            {
                param: 'name',
                type: 'PermissionQueryName',
                description: "The permission to query, for example 'geolocation', 'notifications', 'camera' or 'microphone'. Support for each name varies by browser.",
            },
        ],
        returns: [
            {
                name: 'state',
                type: "'granted' | 'denied' | 'prompt' | 'unsupported'",
                description: "The current state. Starts as 'prompt' until the query resolves, then updates whenever the user changes the permission. 'unsupported' when the Permissions API or the name is not available.",
            },
        ],
    },
    usebattery: {
        name: 'useBattery',
        description: 'Reads the battery level and charging state from the Battery Status API. Use it to pause heavy work or warn the user when the battery is low.',
        category: 'Browser & Device',
        level: 'basic',
        since: '2.1.0',
        signature: 'useBattery(): BatteryState',
        usage: `import {useBattery} from '@zenuilabs/react-hooks';

export default function App() {
  const {isSupported, level, charging, dischargingTime} = useBattery();

  if (!isSupported) {
    return <p>Battery status is not available in this browser.</p>;
  }

  const percent = Math.round(level * 100);
  const minutesLeft = Number.isFinite(dischargingTime)
    ? Math.round(dischargingTime / 60)
    : null;

  return (
    <div>
      <p>
        Battery: {percent}% {charging ? '(charging)' : ''}
      </p>
      {minutesLeft !== null && <p>About {minutesLeft} minutes left.</p>}
      {!charging && percent < 20 && (
        <p role="alert">Battery is low. Video autoplay is paused.</p>
      )}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isSupported', type: 'boolean', description: 'False when navigator.getBattery is missing, which is the case in Firefox and Safari.'},
            {name: 'level', type: 'number', description: 'Charge level from 0 to 1. Defaults to 1 until the first reading.'},
            {name: 'charging', type: 'boolean', description: 'True while the device is plugged in.'},
            {name: 'chargingTime', type: 'number', description: 'Seconds until fully charged. Infinity when discharging or unknown.'},
            {name: 'dischargingTime', type: 'number', description: 'Seconds until the battery is empty. Infinity when charging or unknown.'},
        ],
    },
    usecolorscheme: {
        name: 'useColorScheme',
        description: 'Stores a light, dark or system color scheme preference and resolves it against the OS setting. The choice persists to localStorage, syncs across tabs, and is hydration safe.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useColorScheme(options?: ColorSchemeOptions): ColorSchemeResult',
        usage: `import {useEffect} from 'react';
import {useColorScheme} from '@zenuilabs/react-hooks';

const choices = ['light', 'dark', 'system'] as const;

export default function App() {
  const {scheme, resolved, setScheme} = useColorScheme({storageKey: 'app-theme'});

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  return (
    <fieldset>
      <legend>Theme</legend>
      {choices.map((choice) => (
        <label key={choice} style={{marginRight: 12}}>
          <input
            type="radio"
            name="theme"
            checked={scheme === choice}
            onChange={() => setScheme(choice)}
          />
          {choice}
        </label>
      ))}
      <p>Rendering in {resolved} mode.</p>
    </fieldset>
  );
}`,
        api: [
            {param: 'options.storageKey', type: 'string', description: "localStorage key for the preference. Defaults to 'color-scheme'."},
        ],
        returns: [
            {name: 'scheme', type: "'light' | 'dark' | 'system'", description: "The stored preference. 'system' until the stored value is read after mount."},
            {name: 'resolved', type: "'light' | 'dark'", description: "The scheme to render. Follows prefers-color-scheme when scheme is 'system'. 'light' on the server."},
            {name: 'setScheme', type: "(scheme: 'light' | 'dark' | 'system') => void", description: 'Save a new preference. Updates every hook instance with the same key, in this tab and in others.'},
        ],
    },
    usereducedmotion: {
        name: 'useReducedMotion',
        description: 'Returns true when the user has asked the OS to reduce motion. Use it to shorten or skip animations that are not essential.',
        category: 'Browser & Device',
        level: 'basic',
        since: '2.1.0',
        signature: 'useReducedMotion(): boolean',
        usage: `import {useState} from 'react';
import {useReducedMotion} from '@zenuilabs/react-hooks';

export default function App() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide' : 'Show'} details
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 200 : 0,
          transition: reduceMotion ? 'none' : 'max-height 400ms ease',
        }}
      >
        <p>Shipping takes 2 to 4 business days. Returns are free for 30 days.</p>
      </div>
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'reduced', type: 'boolean', description: 'True when prefers-reduced-motion is set to reduce. Updates live. False on the server and before the first client effect.'},
        ],
    },
    usewakelock: {
        name: 'useWakeLock',
        description: 'Keeps the screen from dimming with the Screen Wake Lock API. The lock is requested again when the tab becomes visible, so it survives tab switches until you release it.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useWakeLock(): WakeLockResult',
        usage: `import {useWakeLock} from '@zenuilabs/react-hooks';

export default function RecipeStep() {
  const {isSupported, isActive, error, request, release} = useWakeLock();

  return (
    <div>
      <h2>Step 3: knead the dough for 10 minutes</h2>
      {isSupported ? (
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => (isActive ? release() : request())}
          />
          Keep the screen on while I cook
        </label>
      ) : (
        <p>Your browser cannot keep the screen awake.</p>
      )}
      {error && <p role="alert">{error.message}</p>}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isSupported', type: 'boolean', description: 'False when navigator.wakeLock is missing.'},
            {name: 'isActive', type: 'boolean', description: 'True while a screen wake lock is held. Becomes false when the browser drops the lock, for example when the tab is hidden.'},
            {name: 'error', type: 'Error | null', description: 'The last request error, such as a NotAllowedError when battery saver is on.'},
            {name: 'request', type: '() => Promise<void>', description: 'Acquire the lock and keep re-acquiring it whenever the tab becomes visible.'},
            {name: 'release', type: '() => Promise<void>', description: 'Release the lock and stop re-acquiring it. The lock is also released on unmount.'},
        ],
    },
    usespeechsynthesis: {
        name: 'useSpeechSynthesis',
        description: 'Reads text aloud with the Web Speech API. Loads the voice list, which arrives asynchronously, and tracks speaking and paused state.',
        category: 'Media',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useSpeechSynthesis(): SpeechSynthesisResult',
        usage: `import {useState} from 'react';
import {useSpeechSynthesis} from '@zenuilabs/react-hooks';

export default function App() {
  const {isSupported, voices, speaking, speak, cancel} = useSpeechSynthesis();
  const [voiceName, setVoiceName] = useState('');
  const article = 'The library opens at nine. Late returns are free this week.';

  if (!isSupported) return <p>Text to speech is not available.</p>;

  const voice = voices.find((v) => v.name === voiceName) ?? null;

  return (
    <div>
      <p>{article}</p>
      <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)}>
        <option value="">Default voice</option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.name}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
      <button onClick={() => (speaking ? cancel() : speak(article, {voice, rate: 1.1}))}>
        {speaking ? 'Stop' : 'Listen'}
      </button>
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isSupported', type: 'boolean', description: 'False when window.speechSynthesis is missing.'},
            {name: 'voices', type: 'SpeechSynthesisVoice[]', description: 'Installed voices. Empty until the browser fires voiceschanged, then filled in.'},
            {name: 'speaking', type: 'boolean', description: 'True from speak() until the utterance ends, errors or is cancelled.'},
            {name: 'paused', type: 'boolean', description: 'True after pause() until resume() or cancel().'},
            {name: 'speak', type: '(text: string, options?: SpeechSynthesisSpeakOptions) => void', description: 'Cancel anything in progress and speak text. Options: voice, rate (0.1 to 10), pitch (0 to 2), volume (0 to 1) and lang. Numeric options default to 1.'},
            {name: 'pause', type: '() => void', description: 'Pause the current utterance.'},
            {name: 'resume', type: '() => void', description: 'Resume a paused utterance.'},
            {name: 'cancel', type: '() => void', description: 'Stop speaking and clear the queue. Also runs on unmount.'},
        ],
    },
    useshare: {
        name: 'useShare',
        description: 'Opens the native share sheet with the Web Share API. A user cancel is treated as a normal outcome, not an error.',
        category: 'Browser & Device',
        level: 'basic',
        since: '2.1.0',
        signature: 'useShare(): ShareResult',
        usage: `import {useState} from 'react';
import {useShare} from '@zenuilabs/react-hooks';

export default function ShareButton({title, url}: {title: string; url: string}) {
  const {isSupported, isSharing, error, share} = useShare();
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (isSupported) {
      await share({title, url});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <div>
      <button onClick={onClick} disabled={isSharing}>
        {isSupported ? 'Share' : copied ? 'Link copied' : 'Copy link'}
      </button>
      {error && <p role="alert">Could not share: {error.message}</p>}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isSupported', type: 'boolean', description: 'False when navigator.share is missing, which includes most desktop Firefox and Linux browsers.'},
            {name: 'isSharing', type: 'boolean', description: 'True while the share sheet is open.'},
            {name: 'error', type: 'Error | null', description: 'The last failure. Stays null when the user cancels the sheet.'},
            {name: 'canShare', type: '(data?: ShareData) => boolean', description: 'Whether this payload can be shared, for example a file of a given type. Falls back to isSupported when navigator.canShare is missing.'},
            {name: 'share', type: '(data: ShareData) => Promise<boolean>', description: 'Open the share sheet. Resolves true when shared and false when cancelled or failed. Must be called from a user gesture.'},
        ],
    },
    useeyedropper: {
        name: 'useEyeDropper',
        description: 'Picks a color from anywhere on the screen with the EyeDropper API. Useful for design tools, theme editors and color inputs.',
        category: 'Browser & Device',
        level: 'basic',
        since: '2.1.0',
        signature: 'useEyeDropper(): EyeDropperResult',
        usage: `import {useState} from 'react';
import {useEyeDropper} from '@zenuilabs/react-hooks';

export default function BrandColorField() {
  const {isSupported, open} = useEyeDropper();
  const [value, setValue] = useState('#3b82f6');

  const pick = async () => {
    const color = await open();
    if (color) setValue(color);
  };

  return (
    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
      <input type="color" value={value} onChange={(e) => setValue(e.target.value)} />
      <code>{value}</code>
      {isSupported && <button onClick={pick}>Pick from screen</button>}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isSupported', type: 'boolean', description: 'False when window.EyeDropper is missing, which is the case in Firefox and Safari.'},
            {name: 'color', type: 'string | null', description: 'The last picked color as an sRGB hex string, or null.'},
            {name: 'error', type: 'Error | null', description: 'The last failure. Pressing Escape to cancel is not an error.'},
            {name: 'open', type: '() => Promise<string | null>', description: 'Open the picker. Resolves with the color, or null when cancelled. Must be called from a user gesture. An open picker is aborted on unmount.'},
        ],
    },
    usefiledialog: {
        name: 'useFileDialog',
        description: 'Opens the native file picker without rendering a file input. Use it when the trigger is a custom button, a menu item or a keyboard shortcut.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useFileDialog(options?: FileDialogOptions): FileDialogResult',
        usage: `import {useFileDialog} from '@zenuilabs/react-hooks';

export default function AttachmentPicker() {
  const {files, open, reset} = useFileDialog({accept: 'image/*,.pdf', multiple: true});

  const totalKb = Math.round(files.reduce((sum, f) => sum + f.size, 0) / 1024);

  return (
    <div>
      <button onClick={() => open()}>Attach files</button>
      <button onClick={() => open({accept: 'image/*', capture: 'environment', multiple: false})}>
        Take a photo
      </button>
      {files.length > 0 && (
        <>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
          <p>{files.length} files, {totalKb} KB</p>
          <button onClick={reset}>Clear</button>
        </>
      )}
    </div>
  );
}`,
        api: [
            {param: 'options.accept', type: 'string', description: "Allowed file types, as in the accept attribute, e.g. 'image/*,.pdf'. Defaults to any file."},
            {param: 'options.multiple', type: 'boolean', description: 'Allow more than one file. Defaults to false.'},
            {param: 'options.capture', type: "'user' | 'environment'", description: 'On mobile, open the front (user) or back (environment) camera directly. Ignored on desktop.'},
        ],
        returns: [
            {name: 'files', type: 'File[]', description: 'Files from the last pick. Empty until something is picked.'},
            {name: 'open', type: '(overrides?: FileDialogOptions) => void', description: 'Open the picker. Overrides apply to this call only. Call it from a user gesture.'},
            {name: 'reset', type: '() => void', description: 'Clear the picked files.'},
        ],
    },
    usedocumenttitle: {
        name: 'useDocumentTitle',
        description: 'Sets document.title while the component is mounted and restores the previous title when it unmounts. Use it for page titles and unread counts.',
        category: 'Utilities',
        level: 'basic',
        since: '2.1.0',
        signature: 'useDocumentTitle(title: string, options?: DocumentTitleOptions): void',
        usage: `import {useState} from 'react';
import {useDocumentTitle} from '@zenuilabs/react-hooks';

function Inbox({unread}: {unread: number}) {
  useDocumentTitle(unread > 0 ? \`(\${unread}) Inbox\` : 'Inbox');
  return <p>You have {unread} unread messages.</p>;
}

export default function App() {
  const [unread, setUnread] = useState(3);
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setUnread((n) => n + 1)}>New message</button>
      <button onClick={() => setUnread(0)}>Mark all read</button>
      <button onClick={() => setOpen((o) => !o)}>
        {open ? 'Close inbox' : 'Open inbox'}
      </button>
      {open && <Inbox unread={unread} />}
    </div>
  );
}`,
        api: [
            {param: 'title', type: 'string', description: 'The title to show. Updates whenever it changes.'},
            {param: 'options.restoreOnUnmount', type: 'boolean', description: 'Put back the title that was set before this component mounted. Defaults to true.'},
        ],
        returns: [],
    },
    usescript: {
        name: 'useScript',
        description: 'Loads an external script and reports its status. Each src is injected once, however many components ask for it, so it suits third party SDKs such as maps or payments.',
        category: 'Utilities',
        level: 'intermediate',
        since: '2.1.0',
        signature: "useScript(src: string | null, options?: ScriptOptions): 'idle' | 'loading' | 'ready' | 'error'",
        usage: `import {useScript} from '@zenuilabs/react-hooks';

declare global {
  interface Window {
    confetti?: (options?: {particleCount?: number; spread?: number}) => void;
  }
}

export default function App() {
  const status = useScript(
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
  );

  return (
    <div>
      <p>Script status: {status}</p>
      <button
        disabled={status !== 'ready'}
        onClick={() => window.confetti?.({particleCount: 120, spread: 70})}
      >
        Celebrate
      </button>
      {status === 'error' && <p role="alert">Could not load the script.</p>}
    </div>
  );
}`,
        api: [
            {param: 'src', type: 'string | null', description: "Script URL. Pass null to wait, for example until the user opts in. Status is then 'idle'."},
            {param: 'options.attributes', type: 'Record<string, string>', description: 'Extra attributes for the script tag, such as integrity or crossorigin. Applied once, when the tag is created.'},
            {param: 'options.removeOnUnmount', type: 'boolean', description: 'Remove the tag when the last component using this src unmounts. Defaults to false. A failed script is always removed so a later mount can retry.'},
        ],
        returns: [
            {name: 'status', type: "'idle' | 'loading' | 'ready' | 'error'", description: "Load status shared by every component using the same src. A matching tag already on the page is assumed to be 'ready'."},
        ],
    },
    usebreakpoint: {
        name: 'useBreakpoint',
        description: 'Reports the active min-width breakpoint using matchMedia, so by default components re-render only when a breakpoint is crossed. Opt in to live width tracking when you need the exact width. Hydration safe, with custom breakpoint maps.',
        category: 'Browser & Device',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useBreakpoint<K extends string>(breakpoints?: Record<K, number>, options?: BreakpointOptions): BreakpointResult<K>',
        usage: `import {useBreakpoint} from '@zenuilabs/react-hooks';

const products = ['Desk lamp', 'Notebook', 'Pen set', 'Mug', 'Chair', 'Backpack'];

// Opts in to width tracking, so it re-renders on every resize frame.
function WidthBadge() {
  const {width} = useBreakpoint(undefined, {trackWidth: true});
  return <small>{width}px</small>;
}

export default function ProductGrid() {
  // Re-renders only when the viewport crosses 600 or 1024.
  const {current, isBelow} = useBreakpoint({tablet: 600, desktop: 1024});

  const columns = current === 'desktop' ? 3 : current === 'tablet' ? 2 : 1;

  return (
    <div>
      <WidthBadge />
      {isBelow('tablet') && <button>Filters</button>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
          gap: 12,
        }}
      >
        {products.map((name) => (
          <div key={name} style={{border: '1px solid #ccc', padding: 12}}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        api: [
            {param: 'breakpoints', type: 'Record<K, number>', description: 'Min-width breakpoints in pixels, mobile first. Defaults to {sm: 640, md: 768, lg: 1024, xl: 1280}.'},
            {param: 'options.trackWidth', type: 'boolean', description: 'Listen to resize and update width at most once per animation frame. This re-renders on every resize frame. Defaults to false.'},
        ],
        returns: [
            {name: 'current', type: 'K | null', description: 'The largest breakpoint whose min-width matches, or null below the smallest. null on the server.'},
            {name: 'width', type: 'number', description: 'Viewport width in CSS pixels. By default it is read at mount and whenever a breakpoint is crossed, so it can be stale between crossings. With trackWidth it follows every resize. 0 on the server.'},
            {name: 'isAbove', type: '(key: K) => boolean', description: 'True when the viewport is at least as wide as the breakpoint.'},
            {name: 'isBelow', type: '(key: K) => boolean', description: 'True when the viewport is narrower than the breakpoint. Both helpers return false before the first client effect.'},
        ],
    },
    usedeepcompareeffect: {
        name: 'useDeepCompareEffect',
        description: 'Works like useEffect but compares dependencies by value. Use it when a dependency is an object or array that is rebuilt on every render.',
        category: 'Utilities',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useDeepCompareEffect(effect: EffectCallback, deps: DependencyList): void',
        usage: `import {useState} from 'react';
import {useDeepCompareEffect} from '@zenuilabs/react-hooks';

function Results({filters}: {filters: {query: string; limit: number}}) {
  const [items, setItems] = useState<string[]>([]);

  // filters is a new object on every parent render. A plain useEffect
  // would refetch each time; this one refetches only when its contents change.
  useDeepCompareEffect(() => {
    const params = new URLSearchParams({q: filters.query, limit: String(filters.limit)});
    fetch(\`https://dummyjson.com/products/search?\${params}\`)
      .then((res) => res.json())
      .then((data) => setItems(data.products.map((p: {title: string}) => p.title)));
  }, [filters]);

  return <ul>{items.map((title) => <li key={title}>{title}</li>)}</ul>;
}

export default function App() {
  const [clicks, setClicks] = useState(0);
  return (
    <div>
      <button onClick={() => setClicks((c) => c + 1)}>Re-render ({clicks})</button>
      <Results filters={{query: 'phone', limit: 5}} />
    </div>
  );
}`,
        api: [
            {param: 'effect', type: 'EffectCallback', description: 'The effect to run. May return a cleanup function, as with useEffect.'},
            {param: 'deps', type: 'DependencyList', description: 'Dependencies compared structurally: plain objects, arrays, Date, RegExp, Map and Set by value, NaN equal to NaN, anything else by reference.'},
        ],
        returns: [],
    },
    usewhydidyouupdate: {
        name: 'useWhyDidYouUpdate',
        description: 'A development helper that reports which props changed since the last render. Use it to find the prop that breaks a memoized component, then remove it.',
        category: 'Utilities',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useWhyDidYouUpdate<P extends object>(name: string, props: P): WhyDidYouUpdateChanges',
        usage: `import {memo, useState} from 'react';
import {useWhyDidYouUpdate} from '@zenuilabs/react-hooks';

type CardProps = {title: string; style: {color: string}; onOpen: () => void};

const Card = memo(function Card(props: CardProps) {
  // Logs: [why-did-you-update] Card {style: {...}, onOpen: {...}}
  useWhyDidYouUpdate('Card', props);
  return (
    <button style={props.style} onClick={props.onOpen}>
      {props.title}
    </button>
  );
});

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Parent render {count}</button>
      {/* style and onOpen are new on every render, so memo cannot skip Card */}
      <Card title="Report" style={{color: 'teal'}} onOpen={() => alert('open')} />
    </div>
  );
}`,
        api: [
            {param: 'name', type: 'string', description: 'Label printed with each log line.'},
            {param: 'props', type: 'P', description: 'The props (or any object of values) to compare with the previous committed render using Object.is.'},
        ],
        returns: [
            {name: 'changes', type: 'Record<string, {from: unknown; to: unknown}>', description: 'Keys that changed since the last render, with old and new values. Empty on the first render and when nothing changed.'},
        ],
    },

    // Foundation hooks. They shipped with 2.1.0 and power most of the hooks above.
    useisomorphiclayouteffect: {
        name: 'useIsomorphicLayoutEffect',
        description: 'useLayoutEffect in the browser and useEffect on the server. Use it for DOM measurements before paint in code that also renders on the server.',
        category: 'Utilities',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList): void',
        usage: `import {useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from '@zenuilabs/react-hooks';

function Tooltip({text, anchorTop}: {text: string; anchorTop: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(anchorTop);

  // Measures before the browser paints, so the tooltip never flashes
  // in the wrong spot. On the server it runs as a normal effect.
  useIsomorphicLayoutEffect(() => {
    const height = ref.current?.offsetHeight ?? 0;
    setTop(anchorTop - height - 8);
  }, [anchorTop, text]);

  return (
    <div ref={ref} style={{position: 'absolute', top, left: 16, padding: 8, background: '#222', color: '#fff'}}>
      {text}
    </div>
  );
}

export default function App() {
  return (
    <div style={{position: 'relative', height: 200}}>
      <Tooltip text="Saved to your drafts" anchorTop={120} />
    </div>
  );
}`,
        api: [
            {param: 'effect', type: 'EffectCallback', description: 'The effect to run. May return a cleanup function.'},
            {param: 'deps', type: 'DependencyList', description: 'Optional dependency list, as with useLayoutEffect.'},
        ],
        returns: [],
    },
    uselatest: {
        name: 'useLatest',
        description: 'Returns a ref that always holds the latest value. Read it inside timers, listeners and effects to avoid stale closures without restarting them.',
        category: 'Utilities',
        level: 'basic',
        since: '2.1.0',
        signature: 'useLatest<T>(value: T): { current: T }',
        usage: `import {useEffect, useState} from 'react';
import {useLatest} from '@zenuilabs/react-hooks';

export default function AutoSave() {
  const [draft, setDraft] = useState('');
  const latestDraft = useLatest(draft);

  // The interval starts once. Reading draft directly here would always
  // save the empty string from the first render.
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem('draft', latestDraft.current);
      console.log('Saved', latestDraft.current.length, 'characters');
    }, 5000);
    return () => clearInterval(id);
  }, [latestDraft]);

  return (
    <textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder="Write something. It saves every 5 seconds."
    />
  );
}`,
        api: [
            {param: 'value', type: 'T', description: 'Any value. The ref is updated after every render, before paint.'},
        ],
        returns: [
            {name: 'ref', type: '{ current: T }', description: 'A ref with a stable identity whose current is the value from the latest render. Do not read it during render.'},
        ],
    },
    useeventcallback: {
        name: 'useEventCallback',
        description: 'Returns a function with a stable identity that always calls the latest version of your callback. Pass it to memoized children or effect dependencies without breaking memoization.',
        category: 'Utilities',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useEventCallback<Args extends unknown[], R>(callback: (...args: Args) => R): (...args: Args) => R',
        usage: `import {memo, useState} from 'react';
import {useEventCallback} from '@zenuilabs/react-hooks';

const SaveButton = memo(function SaveButton({onSave}: {onSave: () => void}) {
  console.log('SaveButton rendered');
  return <button onClick={onSave}>Save</button>;
});

export default function Editor() {
  const [text, setText] = useState('');

  // Same function identity on every render, yet it always sees the latest text.
  // SaveButton renders once, no matter how much you type.
  const handleSave = useEventCallback(() => {
    console.log('Saving', text);
  });

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <SaveButton onSave={handleSave} />
    </div>
  );
}`,
        api: [
            {param: 'callback', type: '(...args: Args) => R', description: 'The function to call. It can read the latest props and state.'},
        ],
        returns: [
            {name: 'fn', type: '(...args: Args) => R', description: 'A stable function that forwards its arguments to the latest callback. Call it from events and effects, not during render.'},
        ],
    },
    useisclient: {
        name: 'useIsClient',
        description: 'Returns false during server rendering and the first client render, then true. Use it to render browser-only content without hydration mismatches.',
        category: 'Utilities',
        level: 'basic',
        since: '2.1.0',
        signature: 'useIsClient(): boolean',
        usage: `import {useIsClient} from '@zenuilabs/react-hooks';

export default function LocalTime({iso}: {iso: string}) {
  const isClient = useIsClient();

  // The server does not know the reader's time zone. Rendering the UTC
  // string first and the local one after hydration avoids a mismatch.
  if (!isClient) {
    return <time dateTime={iso}>{new Date(iso).toUTCString()}</time>;
  }

  return (
    <time dateTime={iso}>
      {new Date(iso).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})}
    </time>
  );
}`,
        api: [],
        returns: [
            {name: 'isClient', type: 'boolean', description: 'False on the server and during the first client render. True after the component mounts.'},
        ],
    },
    useismounted: {
        name: 'useIsMounted',
        description: 'Returns a function that reports whether the component is still mounted. Check it after async work before updating state or starting follow-up work.',
        category: 'Utilities',
        level: 'basic',
        since: '2.1.0',
        signature: 'useIsMounted(): () => boolean',
        usage: `import {useState} from 'react';
import {useIsMounted} from '@zenuilabs/react-hooks';

export default function ProfileLoader({userId}: {userId: number}) {
  const isMounted = useIsMounted();
  const [name, setName] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
    const user = await res.json();
    // The user may have navigated away while the request was in flight.
    if (!isMounted()) return;
    setName(user.name);
  };

  return (
    <div>
      <button onClick={load}>Load profile</button>
      {name && <p>{name}</p>}
    </div>
  );
}`,
        api: [],
        returns: [
            {name: 'isMounted', type: '() => boolean', description: 'A stable function. Returns true between mount and unmount, false before mount and after unmount.'},
        ],
    },
};
