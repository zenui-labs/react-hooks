'use client'

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Logo from '@/assets/logo.svg'
import {Github, Menu, Moon, Sun, X} from "lucide-react";

const Mobilenav = ({hasGradientBg = true}: { hasGradientBg?: boolean }) => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
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
        <header className={`${scrolled && 'pt-6 px-4'} transition-all duration-300 lg:hidden fixed w-full top-0 z-50`}>
            <div
                className={`${scrolled ? 'max-w-[1100px] backdrop-blur-3xl py-3' : 'max-w-[1300px] py-5'} transition-all duration-300 rounded-full mx-auto px-6 flex items-center justify-between`}>
                <Link href={'/'} className='cursor-pointer'>
                    <Image src={Logo} alt='logo' className='size-10'/>
                </Link>
                <div
                    className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-gray-700' : 'text-white'} flex items-center gap-4`}>
                    <a href='https://github.com/zenui-labs/react-hooks' target='_blank' rel='noopener noreferrer'
                       className='hover:scale-120 transition-all duration-200'>
                        <Github size={24}/>
                    </a>
                    <button onClick={toggleTheme}
                            className='cursor-pointer hover:scale-120 transition-all duration-200'>
                        {currentTheme === 'light' ? <Moon size={24}/> : <Sun size={24}/>}
                    </button>
                    <button type={'button'} onClick={() => setSidebarOpen(true)}>
                        <Menu size={30}/>
                    </button>
                </div>
            </div>

            <aside
                className={`${sidebarOpen ? 'translate-x-0' : 'translate-x-[100%]'} transition-all duration-300 flex flex-col bg-white fixed top-0 h-screen right-0 w-[80%] z-50 p-6 gap-8 shadow-2xl`}>

                <X className='text-gray-700' onClick={() => setSidebarOpen(false)}/>

                <Link href="/hooks"
                      className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-black' : 'text-gray-800'} hover:underline text-base`}>
                    Hooks
                </Link>
                <a
                    className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-black' : 'text-gray-800'} hover:underline text-base`}
                    href="/#popular-hooks">
                    Popular Hooks
                </a>
                <a
                    className={`${scrolled || !hasGradientBg ? 'dark:text-darkText text-black' : 'text-gray-800'} hover:underline text-base`}
                    href="https://github.com/zenui-labs/react-hooks/releases" target="_blank"
                    rel="noopener noreferrer">
                    Changelog
                </a>
            </aside>
        </header>
    );
};

export default Mobilenav;
