'use client'

import React from 'react';
import {hooksData} from "@/data";
import {Button} from "@/components/ui/button";
import {Check, ChevronLeft, Copy, ExternalLink, Play} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {HookRenderer} from "@/components/HookDemo";
import {createStackBlitzProject} from "@/lib/utils";
import Link from "next/link";
import Api from "@/sections/hooks/hook-details/api";
import Usages from "@/sections/hooks/hook-details/usages";
import {useCopyToClipboard} from "@zenuilabs/react-hooks";

const Details = ({slug}: { slug: string }) => {
    const hook = hooksData[slug];

    const {isCopied, copyToClipboard} = useCopyToClipboard()

    return (
        <div className='min-h-screen mt-28 max-w-[1300px] mx-auto relative'>
            <div className="container mx-auto px-4 py-8">

                <div className='flex justify-between w-full mb-12'>
                    <div className="">
                        <div className='flex items-center gap-4'>
                            <Link
                                href='/hooks'
                                title='Back to Hooks'
                                className='size-10 hover:bg-gray-50 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center'>
                                <ChevronLeft size={24}/>
                            </Link>
                            <h1 className="text-[2.5rem] font-bold">{hook.name}</h1>
                        </div>
                        <p className="text-lg max-w-2xl">{hook.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={() => createStackBlitzProject(hook)}
                            className="bg-linear-to-r from-brandColor text-white cursor-pointer to-blue-600 hover:from-brandColor/80 hover:to-blue-700"
                        >
                            <Play className="w-4 h-4 mr-2"/>
                            Open in StackBlitz
                        </Button>
                        <Button
                            onClick={() => copyToClipboard(`npm install @zenuilabs/react-hooks`)}
                            variant="outline"
                            className='border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200'
                        >
                            {
                                isCopied ? (
                                    <Check className="w-4 h-4 mr-2"/>
                                ) : (
                                    <Copy className="w-4 h-4 mr-2"/>
                                )
                            }
                            Copy Install Command
                        </Button>
                        <Button variant="outline" asChild
                                className='border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200'>
                            <a href="https://github.com/zenuilabs/react-hooks" target="_blank"
                               rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2"/>
                                View on GitHub
                            </a>
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="demo" className="w-full">
                    <TabsList className="space-x-5">
                        <TabsTrigger value="demo"
                                     className='rounded-none pl-0 border-gray-200 py-2.5 text-base !shadow-none data-[state=active]:border-b-brandColor data-[state=active]:text-brandColor data-[state=active]:border-brandColor !cursor-pointer'>Live
                            Demo</TabsTrigger>
                        <TabsTrigger value="usage"
                                     className='rounded-none border-gray-200 py-2.5 text-base !shadow-none data-[state=active]:border-b-brandColor data-[state=active]:text-brandColor data-[state=active]:border-brandColor !cursor-pointer'>Usage</TabsTrigger>
                        <TabsTrigger value="api"
                                     className='rounded-none border-gray-200 py-2.5 text-base !shadow-none data-[state=active]:border-b-brandColor data-[state=active]:text-brandColor data-[state=active]:border-brandColor !cursor-pointer'>API</TabsTrigger>
                    </TabsList>

                    <TabsContent value="demo" className="space-y-6 mt-2">
                        <HookRenderer hookName={slug}/>
                    </TabsContent>

                    <TabsContent value="usage" className="space-y-6 mt-2">
                        <Usages hook={hook}/>
                    </TabsContent>

                    <TabsContent value="api" className="space-y-6 mt-2">
                        <Api hook={hook}/>
                    </TabsContent>
                </Tabs>
            </div>

            <div className='w-[500px] h-[200px] bg-brandColor/30 z-[-1] absolute bottom-0 -right-28 blur-[140px]'></div>
        </div>
    );
};

export default Details;