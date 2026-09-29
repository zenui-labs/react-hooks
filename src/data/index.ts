import {HOOK_CATEGORIES, type HookCategory, type HookEntry, type HookSummary} from '@/types';
import {coreAHooks} from './core-a';
import {coreBHooks} from './core-b';
import {stateAsyncHooks} from './state-async';
import {realtimeMotionHooks} from './realtime-motion';
import {interactionHooks} from './interaction';
import {browserUtilsHooks} from './browser-utils';

const all = {...coreAHooks, ...coreBHooks, ...stateAsyncHooks, ...realtimeMotionHooks, ...interactionHooks, ...browserUtilsHooks};

/** Every documented hook, keyed by slug. */
export const hooksData: Record<string, HookEntry> = Object.fromEntries(
    Object.entries(all).map(([slug, doc]) => [slug, {...doc, slug}])
);

/** All hooks sorted by name. */
export const hookList: HookEntry[] = Object.values(hooksData).sort((a, b) => a.name.localeCompare(b.name));

/** Categories in display order, with their hooks. Empty categories are dropped. */
export const hooksByCategory: { category: HookCategory; hooks: HookEntry[] }[] = HOOK_CATEGORIES
    .map((category) => ({category, hooks: hookList.filter((hook) => hook.category === category)}))
    .filter((group) => group.hooks.length > 0);

/** Flat order used for previous and next links: category order, then name. */
export const hookSequence: HookEntry[] = hooksByCategory.flatMap((group) => group.hooks);

export function getHook(slug: string): HookEntry | undefined {
    return hooksData[slug];
}

export function toSummary({slug, name, description, category, level, popular, since}: HookEntry): HookSummary {
    return {slug, name, description, category, level, popular: popular ?? false, since};
}

export const summariesByCategory: { category: HookCategory; hooks: HookSummary[] }[] = hooksByCategory
    .map(({category, hooks}) => ({category, hooks: hooks.map(toSummary)}));
