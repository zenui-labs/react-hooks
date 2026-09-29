import pkg from '../../packages/react-hooks/package.json';

export const SITE = {
    name: 'ZenUI React Hooks',
    url: 'https://react-hooks.zenui.net',
    packageName: '@zenuilabs/react-hooks',
    github: 'https://github.com/zenui-labs/react-hooks',
    npm: 'https://www.npmjs.com/package/@zenuilabs/react-hooks',
    releases: 'https://github.com/zenui-labs/react-hooks/releases',
    org: 'https://zenui.net',
} as const;

/** Package version, read from the package itself so the site never drifts from a release. */
export const VERSION = pkg.version;

/** Major.minor of the current release, e.g. "2.1". */
export const RELEASE = toRelease(VERSION);

/** True when a hook first shipped in the current major.minor release. */
export function isNewInRelease(since: string) {
    return toRelease(since) === RELEASE;
}

function toRelease(version: string) {
    return version.split('.').slice(0, 2).join('.');
}

export const PACKAGE_MANAGERS = [
    {id: 'npm', install: 'npm install'},
    {id: 'pnpm', install: 'pnpm add'},
    {id: 'yarn', install: 'yarn add'},
    {id: 'bun', install: 'bun add'},
] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]['id'];
