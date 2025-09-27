import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Check, Copy} from "lucide-react";
import {HookType} from "@/types";
import {useCopyToClipboard} from "@zenuilabs/react-hooks";

const Usages = ({hook}: { hook: HookType }) => {

    const {isCopied, copyToClipboard} = useCopyToClipboard()

    return (
        <>
            <Card className='border-none bg-gray-50'>
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
                  <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{hook.usage}</code>
                  </pre>
                        <Button
                            size="sm"
                            onClick={() => copyToClipboard(hook.usage)}
                            variant="outline"
                            className="absolute border-slate-600 rounded-lg gap-1 cursor-pointer text-white top-2 right-2"
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

            <Card className='border-none bg-gray-50'>
                <CardHeader>
                    <CardTitle>Installation</CardTitle>
                </CardHeader>
                <CardContent className='relative'>
                    <div className="bg-gray-900 text-white p-3 rounded-lg font-mono text-sm">
                        npm install @zenuilabs/react-hooks
                    </div>

                    <Button
                        size="sm"
                        onClick={() => copyToClipboard('npm install @zenuilabs/react-hooks')}
                        variant="outline"
                        className="absolute border-slate-600 rounded-lg gap-1 cursor-pointer text-white top-1 right-7"
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