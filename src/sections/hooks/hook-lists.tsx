'use client'

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {ExternalLink, ListFilter, Search, X} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {AnimatePresence, motion} from "framer-motion";
import {hooksData} from "@/data";
import {useLockBodyScroll} from "@zenuilabs/react-hooks";

const HookLists = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const hooksArray = Object.entries(hooksData).map(([key, hook]) => ({
        id: key,
        ...hook
    }));

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    useLockBodyScroll(categoryDropdownOpen);

    const categories = Array.from(new Set(hooksArray.map(hook => hook.category)));

    // Updated filtering logic to include both search and category
    const filteredHooks = hooksArray.filter(hook => {
        const matchesSearch = hook.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = selectedCategory === '' || hook.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            const target = event.target as HTMLElement;

            if (
                !target.closest('.ct_dropdown') &&
                !target.closest('.ct_btn')
            ) {
                setCategoryDropdownOpen(false);
            }
        }

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    function handleCategorySelect(category: string) {
        setSelectedCategory(category);
        setCategoryDropdownOpen(false);
    }

    function clearCategoryFilter() {
        setSelectedCategory('');
        setCategoryDropdownOpen(false);
        setSearch('');
        setDebouncedSearch('');
    }

    return (
        <div className="max-w-[1300px] min-h-[80dvh] mx-auto px-5 pt-36 mb-20">

            <div className='w-full flex flex-col items-center justify-center mb-16'>
                <h4 className='text-[2.5rem] dark:text-darkText font-bold text-center'>
                    Explore All of the <span className='text-brandColor dark:text-indigo-600'>React Hooks</span>
                </h4>
                <p className='text-base text-center dark:text-darkText/80 max-w-3xl'>
                    Dive into a collection of essential React hooks with clear examples, detailed descriptions,
                    and interactive demos to help you learn and experiment easily.
                </p>

                <div className='w-full flex justify-center items-center gap-3 mt-8'>
                    <label className='relative w-full max-w-2xl'>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder='Search by hook name...'
                            className='w-full border dark:border-gray-700 border-gray-200 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-0 dark:text-darkText'
                        />
                        <Search className='absolute top-3 left-4 dark:text-gray-700 text-gray-300'/>
                    </label>

                    <div className='relative'>
                        <button
                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                            className={`${categoryDropdownOpen && 'bg-gray-100 dark:bg-gray-800'} size-13 ct_btn cursor-pointer rounded-full border dark:hover:bg-gray-800 dark:border-gray-700 dark:text-darkText flex items-center justify-center transition-colors ${
                                selectedCategory
                                    ? 'bg-brandColor text-white border-brandColor'
                                    : 'hover:bg-gray-100 border-gray-200'
                            }`}>
                            <ListFilter/>
                        </button>

                        <AnimatePresence>
                            {
                                categoryDropdownOpen && (
                                    <motion.div
                                        initial={{opacity: 0, y: -10,}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.1}}
                                        className='absolute ct_dropdown dark:bg-gray-800 dark:shadow-gray-900 min-w-max max-w-3xl top-0 right-full bg-white rounded-xl shadow-xl shadow-gray-200 p-2'>
                                        <p
                                            onClick={() => handleCategorySelect('')}
                                            className={`${selectedCategory === '' ? 'bg-gray-100 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-900'} cursor-pointer py-2 px-4 dark:text-darkText/80 rounded-lg font-medium`}>
                                            All Categories
                                        </p>
                                        {
                                            categories?.map(category => (
                                                <p key={category}
                                                   onClick={() => handleCategorySelect(category)}
                                                   className={`${selectedCategory === category ? 'bg-gray-100 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-900'} dark:text-darkText/80 cursor-pointer py-2 px-4 rounded-lg`}>
                                                    {category}
                                                </p>
                                            ))
                                        }
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
                    </div>

                </div>

                {selectedCategory && (
                    <div className='flex items-center gap-2 mt-4'>
                        <span className='text-sm text-gray-600 dark:text-darkText/80'>Filtered by:</span>
                        <div
                            className='flex items-center bg-brandColor/10 dark:bg-brandColor/20 dark:text-indigo-500 text-brandColor pr-1.5 pl-3 py-1 rounded-full text-sm'>
                            {selectedCategory}
                            <button
                                onClick={clearCategoryFilter}
                                className='ml-1 cursor-pointer hover:bg-brandColor/20 rounded-full p-1'
                            >
                                <X size={14}/>
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {selectedCategory ? (
                <div>
                    {filteredHooks.length > 0 && (
                        <>
                            <h2 className="text-[1.5rem] dark:text-darkText font-bold mt-8 mb-4 flex items-center gap-3">
                                <div className="w-2 h-6 bg-linear-to-b from-brandColor to-blue-600 rounded-full"></div>
                                {selectedCategory}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredHooks.map(hook => (
                                    <Card key={hook.name}
                                          className="shadow-none rounded-xl dark:border-gray-800 border-gray-200 flex flex-col h-full">
                                        <CardHeader className='flex-grow'>
                                            <div className="flex flex-col-reverse justify-between mb-2">
                                                <CardTitle
                                                    className="text-[1.5rem] dark:text-darkText font-medium">{hook.name}</CardTitle>
                                                <Badge variant="outline"
                                                       className="text-xs w-max dark:text-indigo-300 mb-1 border-brandColor/50 text-brandColor bg-brandColor/10">{hook.category}</Badge>
                                            </div>
                                            <CardDescription
                                                className='mt-2 dark:text-darkText/80'>{hook.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className='mt-auto'>
                                            <Link href={`/hooks/${hook.name.toLowerCase()}`}
                                                  className="bg-linear-to-r dark:text-indigo-300 py-2 rounded-xl text-[1rem] font-medium flex items-center gap-3 text-brandColor border border-brandColor/50 hover:bg-brandColor/10 transition-all justify-center duration-200">
                                                Try it out
                                                <ExternalLink size={16}/>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                // Show all categories with filtered hooks
                categories.map(category => {
                    const hooksInCategory = filteredHooks.filter(hook => hook.category === category);

                    return (
                        <div key={category}>
                            {
                                hooksInCategory.length ? (
                                    <>
                                        <h2 className="text-[1.5rem] dark:text-darkText font-bold mt-8 mb-4 flex items-center gap-3">
                                            <div
                                                className="w-2 h-6 bg-linear-to-b from-brandColor to-blue-600 rounded-full"></div>
                                            {category}
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {hooksInCategory.map(hook => (
                                                <Card key={hook.name}
                                                      className="shadow-none rounded-xl dark:border-gray-800 border-gray-200 flex flex-col h-full">
                                                    <CardHeader className='flex-grow'>
                                                        <div className="flex flex-col-reverse justify-between mb-2">
                                                            <CardTitle
                                                                className="text-[1.5rem] dark:text-darkText font-medium">{hook.name}</CardTitle>
                                                            <Badge variant="outline"
                                                                   className="text-xs w-max dark:text-indigo-300 mb-1 border-brandColor/50 text-brandColor bg-brandColor/10">{hook.category}</Badge>
                                                        </div>
                                                        <CardDescription
                                                            className='mt-2 dark:text-darkText/80'>{hook.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className='mt-auto'>
                                                        <Link href={`/hooks/${hook.name.toLowerCase()}`}
                                                              className="bg-linear-to-r dark:text-indigo-300 py-2 rounded-xl text-[1rem] font-medium flex items-center gap-3 text-brandColor border border-brandColor/50 hover:bg-brandColor/10 transition-all justify-center duration-200">
                                                            Try it out
                                                            <ExternalLink size={16}/>
                                                        </Link>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                ) : ''
                            }
                        </div>
                    );
                })
            )}

            {filteredHooks.length === 0 && (
                <p className="text-center max-w-4xl break-words mx-auto text-gray-500 mt-10">
                    {selectedCategory
                        ? `No hooks found in "${selectedCategory}" category${debouncedSearch ? ` matching "${debouncedSearch}"` : ''}.`
                        : `No hooks found for "${debouncedSearch}".`
                    }
                </p>
            )}
        </div>
    );
};

export default HookLists;