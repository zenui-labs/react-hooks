import Navbar from "@/sections/landing-page/navbar";
import Footer from "@/sections/landing-page/footer";
import Mobilenav from "@/sections/landing-page/mobilenav";
import React from "react";

export default function Index({children}: { children: React.ReactNode }) {
    return (
        <div className='overflow-clip'>
            <Navbar hasGradientBg={false}/>
            <Mobilenav hasGradientBg={false}/>
            {children}
            <Footer/>
        </div>
    );
}