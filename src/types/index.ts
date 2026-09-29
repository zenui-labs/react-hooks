export type HookLevel = 'basic' | 'intermediate' | 'advanced';

export const HOOK_CATEGORIES = [
    'State',
    'Async & Data',
    'Realtime',
    'Performance',
    'Events & DOM',
    'Interaction',
    'Browser & Device',
    'Media',
    'Time & Motion',
    'Utilities',
] as const;

export type HookCategory = (typeof HOOK_CATEGORIES)[number];

export interface HookParam {
    /** Parameter name as written in the signature, e.g. `options.delay`. */
    param: string;
    type: string;
    description: string;
}

export interface HookReturn {
    name: string;
    type: string;
    description: string;
}

export interface HookDoc {
    /** Exported function name, e.g. `useLocalStorage`. */
    name: string;
    /** One or two plain sentences. Say what it does, then when to use it. */
    description: string;
    category: HookCategory;
    level: HookLevel;
    /** Featured on the landing page. */
    popular?: boolean;
    /** Package version that introduced the hook. */
    since: string;
    /** Full TypeScript signature, e.g. `useToggle(initial?: boolean): ToggleResult`. */
    signature: string;
    /** Standalone example component. Imports only from react and @zenuilabs/react-hooks. */
    usage: string;
    api: HookParam[];
    returns: HookReturn[];
}

/** A doc entry plus its URL slug (lowercase name, e.g. `uselocalstorage`). */
export interface HookEntry extends HookDoc {
    slug: string;
}

/** The fields list views need. Keeps usage code out of client bundles. */
export type HookSummary = Pick<HookEntry, 'slug' | 'name' | 'description' | 'category' | 'level' | 'popular' | 'since'>;
