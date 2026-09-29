import sdk from '@stackblitz/sdk';
import type {HookEntry} from '@/types';
import {SITE} from '@/lib/site';

/** Open the hook's usage example as a Vite + React project on StackBlitz. */
export function openInStackBlitz(hook: HookEntry) {
    sdk.openProject(
        {
            title: `${hook.name} example`,
            description: hook.description,
            template: 'node',
            files: {
                'package.json': JSON.stringify({
                    name: `${hook.slug}-example`,
                    private: true,
                    version: '1.0.0',
                    type: 'module',
                    scripts: {dev: 'vite', build: 'vite build', preview: 'vite preview'},
                    dependencies: {
                        react: '^19.0.0',
                        'react-dom': '^19.0.0',
                        [SITE.packageName]: 'latest',
                    },
                    devDependencies: {
                        '@types/react': '^19.0.0',
                        '@types/react-dom': '^19.0.0',
                        '@vitejs/plugin-react': '^4.3.0',
                        typescript: '^5.6.0',
                        vite: '^6.0.0',
                    },
                }, null, 2),
                'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${hook.name} example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
                // Examples export either a default component or a single named one.
                'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Example from './App';
import './index.css';

const App = (Example as Record<string, unknown>).default
  ?? Object.values(Example).find((value) => typeof value === 'function');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{React.createElement(App as React.ComponentType)}</React.StrictMode>
);`,
                'src/App.tsx': hook.usage,
                'src/index.css': `:root { font-family: system-ui, sans-serif; color-scheme: light dark; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 2rem; }
#root { width: 100%; max-width: 640px; }
button { font: inherit; padding: 0.5rem 0.9rem; border-radius: 8px; border: 1px solid #8884; cursor: pointer; }
input, textarea { font: inherit; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid #8886; }`,
                'vite.config.ts': `import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({plugins: [react()]});`,
                'tsconfig.json': JSON.stringify({
                    compilerOptions: {
                        target: 'ES2020',
                        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                        module: 'ESNext',
                        moduleResolution: 'bundler',
                        jsx: 'react-jsx',
                        strict: true,
                        skipLibCheck: true,
                        noEmit: true,
                    },
                    include: ['src'],
                }, null, 2),
            },
        },
        {newWindow: true, openFile: 'src/App.tsx'}
    );
}
