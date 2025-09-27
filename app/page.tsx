'use client'

import React from 'react';
import Navbar from "@/sections/landing-page/navbar";
import Hero from "@/sections/landing-page/hero";
import Features from "@/sections/landing-page/features";
import PopularHooks from "@/sections/landing-page/popular-hooks";
import Footer from "@/sections/landing-page/footer";

const Page = () => {
    return (
        <>
            <Navbar/>
            <Hero/>
            <Features/>
            <PopularHooks/>
            <Footer/>
        </>
    );
};

export default Page;