import {useEffect, useLayoutEffect} from 'react';
import {isBrowser} from '../utils/env';

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server.
 * Avoids the React SSR warning while keeping synchronous DOM reads on the client.
 */
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
