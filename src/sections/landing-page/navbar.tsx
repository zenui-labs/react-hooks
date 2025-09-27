'use client'

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Logo from '@/assets/logo.svg'

const Navbar = ({hasGradientBg = true}: { hasGradientBg?: boolean }) => {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed w-full top-0 z-50 pt-3">
            <div
                className={`${scrolled ? 'max-w-[1100px] backdrop-blur-3xl' : 'max-w-[1300px]'} transition-all duration-300 rounded-full mx-auto px-6 py-3 flex items-center justify-between`}>
                <Link href={'/'} className='cursor-pointer'>
                    <Image src={Logo} alt='logo' className='size-10'/>
                </Link>
                <nav className="flex items-center gap-8">
                    <Link href="/hooks"
                          className={`${scrolled || !hasGradientBg ? 'text-black' : 'text-white'} hover:underline text-base`}>
                        Hooks
                    </Link>
                    <a
                        className={`${scrolled || !hasGradientBg ? 'text-black' : 'text-white'} hover:underline text-base`}
                        href="https://github.com/zenuilabs/react-hooks" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;