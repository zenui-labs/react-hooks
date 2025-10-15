'use client'

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Logo from '@/assets/logo.svg'
import {Github, Moon, Sun} from "lucide-react";

const Navbar = ({hasGradientBg = true}: { hasGradientBg?: boolean }) => {
    const [scrolled, setScrolled] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('rh-theme') as 'light' | 'dark' || 'dark';
        setCurrentTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

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


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('rh-theme', newTheme);
    }

    return (
        <header className={`${scrolled && 'pt-6'} transition-all duration-300 fixed w-full top-0 z-50`}>
            <div
                className={`${scrolled ? 'max-w-[1100px] backdrop-blur-3xl py-3' : 'max-w-[1300px] py-5'} transition-all duration-300 rounded-full mx-auto px-6 flex items-center justify-between`}>
                <Link href={'/'} className='cursor-pointer'>
                    <Image src={Logo} alt='logo' className='size-10'/>
                </Link>
                <nav className="flex items-center gap-8">
                    <Link href="/hooks"
                          className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-black' : 'text-white'} hover:underline text-base`}>
                        Hooks
                    </Link>
                    <a
                        className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-black' : 'text-white'} hover:underline text-base`}
                        href="#popular-hooks">
                        Popular Hooks
                    </a>
                    <a
                        className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-black' : 'text-white'} hover:underline text-base`}
                        href="https://www.npmjs.com/package/@zenuilabs/react-hooks?activeTab=versions" target="_blank"
                        rel="noopener noreferrer">
                        Changelog
                    </a>
                </nav>

                <div
                    className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-gray-700' : 'text-white'} flex items-center gap-4`}>
                    <a>
                        <Github size={21}/>
                    </a>
                    <button onClick={toggleTheme} className='cursor-pointer'>
                        {currentTheme === 'light' ? <Moon size={21}/> : <Sun size={21}/>}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
