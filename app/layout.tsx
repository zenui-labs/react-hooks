import './globals.css';
import type {Metadata, Viewport} from 'next';
import {Bricolage_Grotesque, Geist, JetBrains_Mono} from 'next/font/google';
import {themeInitScript} from '@/lib/theme';
import {SITE} from '@/lib/site';
import {hookList, summariesByCategory} from '@/data';
import {CommandMenuProvider} from '@/components/site/command-menu';
import {Header} from '@/components/site/header';
import {Footer} from '@/components/site/footer';

const geist = Geist({subsets: ['latin'], variable: '--font-geist', display: 'swap'});
const bricolage = Bricolage_Grotesque({subsets: ['latin'], variable: '--font-bricolage', display: 'swap', axes: ['wdth', 'opsz']});
const jetbrains = JetBrains_Mono({subsets: ['latin'], variable: '--font-jetbrains', display: 'swap'});

const description = `${hookList.length} typed React hooks for state, async data, realtime connections, gestures and browser APIs. SSR-safe, tree-shakeable, zero dependencies.`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: 'ZenUI React Hooks: typed, SSR-safe hooks for React',
        template: '%s | ZenUI React Hooks',
    },
    description,
    keywords: ['React hooks', 'custom React hooks', 'TypeScript hooks', 'Next.js hooks', 'useLocalStorage', 'useWebSocket', 'useDebounce', 'zenui'],
    authors: [{name: 'ZenUI Labs', url: SITE.org}],
    creator: 'ZenUI Labs',
    alternates: {canonical: '/'},
    openGraph: {
        title: 'ZenUI React Hooks',
        description,
        url: SITE.url,
        siteName: 'ZenUI React Hooks',
        images: [{url: 'https://i.ibb.co.com/fYkYqSyk/react-hooks-og-image.png', width: 1200, height: 630, alt: 'ZenUI React Hooks'}],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ZenUI React Hooks',
        description,
        creator: '@zenuilabs',
        images: ['https://i.ibb.co.com/fYkYqSyk/react-hooks-og-image.png'],
    },
};

export const viewport: Viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#f4f3ee'},
        {media: '(prefers-color-scheme: dark)', color: '#0a0a0c'},
    ],
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${geist.variable} ${bricolage.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{__html: themeInitScript}}/>
        </head>
        <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
            Skip to content
        </a>
        <CommandMenuProvider groups={summariesByCategory}>
            <Header/>
            <main id="main">{children}</main>
            <Footer/>
        </CommandMenuProvider>
        </body>
        </html>
    );
}
