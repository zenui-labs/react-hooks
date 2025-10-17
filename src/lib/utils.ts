import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import sdk from '@stackblitz/sdk';
import {HookType} from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function createStackBlitzProject(hook: HookType) {
    // Extract the component code from the usage string
    const componentCode = hook.usage;

    // Create the project configuration
    const project = {
        title: `${hook.name} - React Hook Demo`,
        description: hook.description,
        template: 'node' as const,
        files: {
            'package.json': JSON.stringify({
                name: `${hook.name.toLowerCase()}-demo`,
                version: '1.0.0',
                description: hook.description,
                dependencies: {
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0',
                    '@zenuilabs/react-hooks': 'latest'
                },
                devDependencies: {
                    '@types/react': '^18.2.0',
                    '@types/react-dom': '^18.2.0',
                    'typescript': '^5.0.0',
                    'vite': '^5.0.0',
                    '@vitejs/plugin-react': '^4.0.0'
                },
                scripts: {
                    dev: 'vite',
                    build: 'vite build',
                    preview: 'vite preview'
                }
            }, null, 2),

            'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${hook.name} Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

            'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

            'src/App.tsx': componentCode,

            'src/index.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#root {
  width: 100%;
  max-width: 600px;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #6366f1;
}

p {
  font-size: 1.1rem;
  color: #333;
  margin-top: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #4f46e5;
}`,

            'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,

            'tsconfig.json': JSON.stringify({
                compilerOptions: {
                    target: 'ES2020',
                    useDefineForClassFields: true,
                    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                    module: 'ESNext',
                    skipLibCheck: true,
                    moduleResolution: 'bundler',
                    allowImportingTsExtensions: true,
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: 'react-jsx',
                    strict: true,
                    noUnusedLocals: true,
                    noUnusedParameters: true,
                    noFallthroughCasesInSwitch: true
                },
                include: ['src'],
                references: [{path: './tsconfig.node.json'}]
            }, null, 2),

            'tsconfig.node.json': JSON.stringify({
                compilerOptions: {
                    composite: true,
                    skipLibCheck: true,
                    module: 'ESNext',
                    moduleResolution: 'bundler',
                    allowSyntheticDefaultImports: true
                },
                include: ['vite.config.ts']
            }, null, 2)
        }
    };

    // Open the project in StackBlitz
    sdk.openProject(project, {
        newWindow: true,
        openFile: 'src/App.tsx'
    });
}

