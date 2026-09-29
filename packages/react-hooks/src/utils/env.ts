/** True when running in a browser (not during SSR or in a worker without a DOM). */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/** True when `navigator` exists. Some hooks need it even outside a DOM. */
export const hasNavigator = typeof navigator !== 'undefined';

export function noop() {
}
