'use client'

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {hooksData} from "@/data";

const PopularHooks = ({className = 'mt-30'}: { className?: string }) => {

    const hooksArray = Object.entries(hooksData).map(([key, hook]) => ({
        id: key,
        ...hook
    }));

    const items = hooksArray.filter(item => item.mostUse)

    return (
        <section id={'popular-hooks'} className={`${className} mb-16 relative px-4 lg:px-0 mx-auto max-w-[1300px]`}>
            <div className="text-center mb-12">
                <h2 className="text-[1.8rem] leading-tight lg:text-[2.5rem] dark:text-darkText font-bold text-center">Most
                    Useful Hooks</h2>
                <p className="text-base dark:text-darkText/80 max-w-2xl mx-auto">
                    Explore some of our most popular hooks that developers love using in their React applications.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((hook) => (
                    <Card key={hook.name}
                          className="shadow-none rounded-xl dark:border-gray-800 border-gray-200 flex flex-col h-full">
                        <CardHeader className='flex-grow'>
                            <div className="flex flex-col-reverse justify-between mb-2">
                                <CardTitle
                                    className="text-[1.5rem] dark:text-darkText font-medium">{hook.name}</CardTitle>
                                <Badge variant="outline"
                                       className="text-xs w-max dark:text-indigo-300 mb-1 border-brandColor/50 text-brandColor bg-brandColor/10">{hook.category}</Badge>
                            </div>
                            <CardDescription className='mt-2 dark:text-darkText/80'>{hook.description}</CardDescription>
                        </CardHeader>
                        <CardContent className='mt-auto'>
                            <Link href={`/hooks/${hook.name.toLowerCase()}`}
                                  className="bg-linear-to-r dark:text-indigo-300 py-2 rounded-xl text-[1rem] font-medium flex items-center gap-2 hover:gap-3 text-brandColor border border-brandColor/50 hover:bg-brandColor/10 transition-all justify-center duration-200">
                                Try it out
                                <ArrowRight size={18}/>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div
                className='w-full h-[250px] dark:to-darkBg dark:from-darkBg/40 flex items-end justify-center bg-gradient-to-b from-white/40 to-white absolute bottom-0 left-0 z-20'>
                <Link href="/hooks"
                      className="bg-linear-to-r px-8 py-3.5 rounded-xl text-[1rem] font-medium flex items-center gap-2 text-white group bg-brandColor">
                    View All Hooks
                    <ArrowRight size={20} className='group-hover:ml-1 transition-all duration-200'/>
                </Link>
            </div>

        </section>
    );
};

export default PopularHooks;