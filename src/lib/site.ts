export const SITE = {
    name: 'ZenUI React Hooks',
    url: 'https://react-hooks.zenui.net',
    packageName: '@zenuilabs/react-hooks',
    github: 'https://github.com/zenui-labs/react-hooks',
    npm: 'https://www.npmjs.com/package/@zenuilabs/react-hooks',
    releases: 'https://github.com/zenui-labs/react-hooks/releases',
    org: 'https://zenui.net',
} as const;

export const PACKAGE_MANAGERS = [
    {id: 'npm', install: 'npm install'},
    {id: 'pnpm', install: 'pnpm add'},
    {id: 'yarn', install: 'yarn add'},
    {id: 'bun', install: 'bun add'},
] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]['id'];
