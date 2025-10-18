import './globals.css';
import type {Metadata} from 'next';
import {Inter, Space_Grotesk} from 'next/font/google';

const inter = Inter({subsets: ['latin']});
const spaceGrotesk = Space_Grotesk({subsets: ['vietnamese']});

export const metadata: Metadata = {
    title: 'ZenUI Labs React Hooks - Modern React Hooks Library',
    description:
        'A collection of reusable React hooks for modern web development. TypeScript support, production-ready, and developer-friendly.',
    keywords: [
        'React hooks',
        'custom react hooks',
        'react hook library',
        'zenui hooks',
        'react state management',
        'frontend development',
        'react utils',
        'useLocalStorage',
        'useDebounce',
        'useAsync',
        'open source react library',
    ],
    authors: [{name: 'ZenUI Labs', url: 'https://zenui.net'}],
    creator: 'ZenUI Labs',
    publisher: 'ZenUI Labs',
    metadataBase: new URL('https://react-hooks.zenui.net'),
    alternates: {
        canonical: 'https://react-hooks.zenui.net',
    },
    openGraph: {
        title: 'ZenUI Labs React Hooks - Modern React Hooks Library for Developers',
        description:
            'Explore ZenUI Labs React Hooks — a developer-focused library of modern, reusable, and TypeScript-ready React hooks for efficient and elegant web development.',
        url: 'https://react-hooks.zenui.net',
        siteName: 'ZenUI Labs React Hooks',
        images: [
            {
                url: 'https://i.ibb.co.com/fYkYqSyk/react-hooks-og-image.png',
                width: 1200,
                height: 630,
                alt: 'ZenUI Labs React Hooks - Modern React Hooks Library',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ZenUI Labs React Hooks - Modern, TypeScript-ready React Hooks',
        description:
            'A production-ready collection of reusable React hooks designed for modern web apps. Built by ZenUI Labs.',
        creator: '@zenuilabs',
        images: ['https://i.ibb.co.com/fYkYqSyk/react-hooks-og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className={`${spaceGrotesk.className} dark:bg-darkBg`}>
            {children}
        </div>
        </body>
        </html>
    );
}
