import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {HookType} from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const createStackBlitzProject = (hook: HookType) => {
    const project = {
        files: {
            'package.json': {
                content: JSON.stringify({
                    name: `${hook.name.toLowerCase()}-example`,
                    version: '1.0.0',
                    dependencies: {
                        'react': '^18.2.0',
                        'react-dom': '^18.2.0',
                        '@types/react': '^18.2.0',
                        '@types/react-dom': '^18.2.0',
                        '@zenuilabs/react-hooks': '^1.0.0'
                    },
                    scripts: {
                        start: 'react-scripts start'
                    }
                }, null, 2)
            },
            'src/App.tsx': {
                content: `import React, { useState, useEffect } from 'react';
${hook.usage}`
            },
            'src/index.tsx': {
                content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);`
            },
            'public/index.html': {
                content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${hook.name} Example</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
            }
        },
        title: `${hook.name} Example`,
        description: hook.description,
        template: 'create-react-app-typescript'
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://stackblitz.com/run';
    form.target = '_blank';

    const projectInput = document.createElement('input');
    projectInput.type = 'hidden';
    projectInput.name = 'project[files]';
    projectInput.value = JSON.stringify(project);

    form.appendChild(projectInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};
