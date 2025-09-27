'use client'

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {ArrowRight, ExternalLink} from "lucide-react";

const PopularHooks = ({mtValue = 30}: { mtValue?: number }) => {
    return (
        <section className={`mt-${mtValue} mb-16 relative px-4 lg:px-0 mx-auto max-w-[1300px]`}>
            <div className="text-center mb-12">
                <h2 className="text-[2.5rem] font-bold text-center">Most Useful Hooks</h2>
                <p className="text-base max-w-2xl mx-auto">
                    Explore some of our most popular hooks that developers love using in their React applications.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        name: 'useLocalStorage',
                        description: 'Persist state in localStorage with automatic serialization',
                        category: 'State'
                    },
                    {
                        name: 'useDebounce',
                        description: 'Delay value updates for performance optimization',
                        category: 'Performance'
                    },
                    {
                        name: 'useFetch',
                        description: 'Simple data fetching with loading and error states',
                        category: 'Data'
                    },
                    {
                        name: 'useToggle',
                        description: 'Boolean state management with helper functions',
                        category: 'State'
                    },
                    {
                        name: 'useHover',
                        description: 'Track hover state of DOM elements',
                        category: 'DOM'
                    },
                    {
                        name: 'useCounter',
                        description: 'Counter with increment, decrement, and reset',
                        category: 'State'
                    }
                ].map((hook) => (
                    <Card key={hook.name} className="shadow-none rounded-xl border-gray-200 flex flex-col h-full">
                        <CardHeader className='flex-grow'>
                            <div className="flex flex-col-reverse justify-between mb-2">
                                <CardTitle className="text-[1.5rem] font-medium">{hook.name}</CardTitle>
                                <Badge variant="outline"
                                       className="text-xs w-max mb-1 border-brandColor/50 text-brandColor bg-brandColor/10">{hook.category}</Badge>
                            </div>
                            <CardDescription className='mt-2'>{hook.description}</CardDescription>
                        </CardHeader>
                        <CardContent className='mt-auto !p-0'>
                            <Link href={`/hooks/${hook.name.toLowerCase()}`}
                                  className="bg-linear-to-r py-2 rounded-xl text-[1rem] font-medium flex items-center gap-3 text-brandColor border border-brandColor/50 hover:bg-brandColor/10 transition-all justify-center duration-200">
                                Try it out
                                <ExternalLink size={16}/>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div
                className='w-full h-[250px] flex items-end justify-center bg-gradient-to-b from-white/40 to-white absolute bottom-0 left-0 z-20'>
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