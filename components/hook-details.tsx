'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Play, ExternalLink, Code, CheckCircle } from 'lucide-react';
import {HookRenderer} from '@/components/HookDemo';
import {hooksData} from "@/data";

export default function HookDetailPage({ slug }: { slug: string }) {
    const hook = hooksData[slug];

    if (!hook) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6 text-center">
                        <h1 className="text-2xl font-bold mb-2">Hook Not Found</h1>
                        <p className="text-muted-foreground mb-4">The requested hook doesn't exist.</p>
                        <Link href="/hooks">
                            <Button>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Hooks
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const createStackBlitzProject = () => {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href="/hooks">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                All Hooks
                            </Button>
                        </Link>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Code className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl font-mono text-purple-600">{hook.name}</h1>
                                <Badge variant="outline" className="text-xs">{hook.category}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            gdsgdsa
                        </Button>
                        <Button
                            size="sm"
                            onClick={createStackBlitzProject}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Try Online
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Hook Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4 font-mono text-purple-600">{hook.name}</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">{hook.description}</p>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="demo" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="demo">Live Demo</TabsTrigger>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                        <TabsTrigger value="api">API</TabsTrigger>
                    </TabsList>

                    {/* Live Demo Tab */}
                    <TabsContent value="demo" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Interactive Demo
                                </CardTitle>
                                <CardDescription>
                                    Try out {hook.name} with this interactive example. The demo runs in real-time to show you how the hook behaves.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
                                    <HookRenderer hookName={slug} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Usage Tab */}
                    <TabsContent value="usage" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    How to Use
                                </CardTitle>
                                <CardDescription>
                                    Here's a complete example showing how to use {hook.name} in your React components.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                  <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{hook.usage}</code>
                  </pre>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-2 right-2"
                                    >gdsag
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Installation */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Installation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-900 text-white p-3 rounded-lg font-mono text-sm">
                                    npm install @zenuilabs/react-hooks
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* API Tab */}
                    <TabsContent value="api" className="space-y-6">
                        {/* Parameters */}
                        {hook.api.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Parameters</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {hook.api.map((param: any, index: number) => (
                                            <div key={index} className="border-b pb-3 last:border-b-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                        {param.param}
                                                    </code>
                                                    <Badge variant="outline" className="text-xs">
                                                        {param.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{param.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Returns */}
                        {hook.returns.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Returns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {hook.returns.map((ret: any, index: number) => (
                                            <div key={index} className="border-b pb-3 last:border-b-0">
                                                <div className="flex items-start gap-2 mb-1">
                                                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                        {ret.name}
                                                    </code>
                                                    <Badge variant="outline" className="text-xs">
                                                        {ret.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{ret.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* TypeScript */}
                        <Card>
                            <CardHeader>
                                <CardTitle>TypeScript Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-3">
                                    This hook is fully typed and provides excellent TypeScript support out of the box.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <code>
                                        import type &#123; {hook.name}Result &#125; from '@zenuilabs/react-hooks';
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Button
                        onClick={createStackBlitzProject}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Open in StackBlitz
                    </Button>
                    <Button
                        variant="outline"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Install Command
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="https://github.com/zenuilabs/react-hooks" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on GitHub
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}