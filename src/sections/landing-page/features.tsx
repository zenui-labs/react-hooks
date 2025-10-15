'use client'

import React from 'react';
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Code, Shield, Zap} from "lucide-react";

const Features = () => {
    return (
        <section className="max-w-[1300px] mx-auto px-4 lg:px-0">
            <h2 className="text-[2.5rem] font-bold text-center dark:text-darkText">Why Choose Our Hooks?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
                <Card
                    className="border-purple-100 dark:border-purple-900 dark:shadow-purple-900 hover:border-purple-200 hover:shadow-lg cursor-pointer transition-all duration-200 rounded-xl shadow-purple-200">
                    <CardHeader>
                        <div
                            className="w-12 h-12 dark:bg-purple-900 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 dark:text-purple-400 text-purple-600"/>
                        </div>
                        <CardTitle className='my-3 dark:text-darkText'>Performance Optimized</CardTitle>
                        <CardDescription className='dark:text-darkText/80'>
                            Built with performance in mind. Each hook is optimized for minimal re-renders and
                            maximum efficiency.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card
                    className="border-blue-100 dark:border-blue-900 dark:shadow-blue-900 hover:border-blue-200 hover:shadow-lg cursor-pointer transition-all duration-200 rounded-xl shadow-blue-200">
                    <CardHeader>
                        <div
                            className="w-12 h-12 dark:bg-blue-900 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 dark:text-blue-400 text-blue-600"/>
                        </div>
                        <CardTitle className='my-3 dark:text-darkText'>TypeScript First</CardTitle>
                        <CardDescription className='dark:text-darkText/80'>
                            Full TypeScript support with comprehensive type definitions. Catch errors early and
                            improve your DX.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card
                    className="border-green-100 dark:border-green-900 dark:shadow-green-900 hover:border-green-200 hover:shadow-lg cursor-pointer transition-all duration-200 rounded-xl shadow-green-200">
                    <CardHeader>
                        <div
                            className="w-12 h-12 dark:bg-green-900 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Code className="w-6 h-6 dark:text-green-400 text-green-600"/>
                        </div>
                        <CardTitle className='my-3 dark:text-darkText'>Zero Dependencies</CardTitle>
                        <CardDescription className='dark:text-darkText/80'>
                            Pure React hooks with no external dependencies. Lightweight and tree-shakeable for
                            optimal bundle size.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </section>
    );
};

export default Features;