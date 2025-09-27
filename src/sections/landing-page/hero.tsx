'use client'

import React from 'react';
import {Package, Webhook} from "lucide-react";
import Link from "next/link";
import ShimmerButton from "@/components/ui/shimmer-button";

const Hero = () => {
    return (
        <section className="py-20 min-h-[100dvh] content-center relative px-4">

            <div
                className="absolute inset-0 z-[-1]"
                style={{
                    background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #3B03A9 100%)",
                }}
            />

            <div className="container mx-auto text-center z-0">
                <ShimmerButton/>
                <h1 className="text-[4rem] font-bold">
                    Modern React Hooks Library
                </h1>
                <p className="text-lg font-normal max-w-4xl mx-auto">
                    A collection of production-ready React hooks that supercharge your development workflow.
                    TypeScript support, zero dependencies, and developer-friendly documentation.
                </p>
                <div className="flex flex-col mt-16 sm:flex-row gap-4 justify-center items-center">
                    <a target={'_blank'} href="https://www.npmjs.com/package/@zenuilabs/react-hooks"
                       className="bg-linear-to-r px-8 py-3.5 rounded-xl text-[1rem] font-medium flex items-center gap-2 text-white bg-brandColor hover:bg-brandColor/80 transition-all duration-200">
                        <Package size={20}/>
                        Install Package
                    </a>
                    <Link href="/hooks"
                          className="bg-linear-to-r px-8 py-3.5 rounded-xl text-[1rem] font-medium flex items-center gap-2 text-brandColor border border-brandColor/50 hover:bg-brandColor/10 transition-all duration-200">
                        <Webhook size={20}/>
                        Explore Hooks
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;