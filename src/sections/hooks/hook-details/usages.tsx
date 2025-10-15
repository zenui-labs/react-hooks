'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Check, Copy} from "lucide-react";
import {HookType} from "@/types";
import {useCopyToClipboard} from "@zenuilabs/react-hooks";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import vsDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import vsLight from 'react-syntax-highlighter/dist/esm/styles/prism/vs';

const Usages = ({hook}: { hook: HookType }) => {
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('rh-theme') || 'dark');

    const syntaxTheme = currentTheme === 'dark' ? vsDark : vsLight;

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setCurrentTheme(isDark ? 'dark' : 'light');
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const {isCopied, copyToClipboard} = useCopyToClipboard()

    return (
        <>
            <Card className='border-none bg-gray-50 dark:bg-gray-900 dark:text-darkText'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        How to Use
                    </CardTitle>
                    <CardDescription>
                        Here&#39;s a complete example showing how to use {hook.name} in your React components.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <SyntaxHighlighter
                            language="javascript"
                            customStyle={{
                                margin: 0,
                                fontSize: '12px !important',
                                border: 'none',
                                borderRadius: '0.5rem',
                                lineHeight: '1.6'
                            }}
                            style={syntaxTheme}
                            showLineNumbers={false}
                            wrapLines={true}
                            wrapLongLines={true}
                        >
                            {hook.usage}
                        </SyntaxHighlighter>
                        <Button
                            size="sm"
                            onClick={() => copyToClipboard(hook.usage)}
                            variant="outline"
                            className="absolute border-gray-200 dark:border-slate-700 rounded-lg gap-1 cursor-pointer dark:text-darkText top-2 right-2"
                        >
                            {
                                isCopied ? (
                                    <>
                                        <Check size={16}/>
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16}/>
                                        Copy
                                    </>
                                )
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className='border-none dark:bg-gray-900 dark:text-darkText bg-gray-50'>
                <CardHeader>
                    <CardTitle>Installation</CardTitle>
                </CardHeader>
                <CardContent className='relative'>
                    <SyntaxHighlighter
                        language="bash"
                        customStyle={{
                            margin: 0,
                            fontSize: '14px !important',
                            border: 'none',
                            borderRadius: '0.5rem',
                        }}
                        style={syntaxTheme}
                    >
                        npm install @zenuilabs/react-hooks
                    </SyntaxHighlighter>

                    <Button
                        size="sm"
                        onClick={() => copyToClipboard('npm install @zenuilabs/react-hooks')}
                        variant="outline"
                        className="absolute border-gray-200 dark:border-slate-700 rounded-lg gap-1 cursor-pointer dark:text-darkText top-2 right-7"
                    >
                        {
                            isCopied ? (
                                <Check size={16}/>
                            ) : (
                                <Copy size={16}/>
                            )
                        }
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};

export default Usages;