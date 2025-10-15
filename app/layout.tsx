import './globals.css';
import type {Metadata} from 'next';
import {Inter, Space_Grotesk} from 'next/font/google';

const inter = Inter({subsets: ['latin']});
const spaceGrotesk = Space_Grotesk({subsets: ['vietnamese']});

export const metadata: Metadata = {
    title: 'ZenUI Labs React Hooks - Modern React Hooks Library',
    description:
        'A collection of reusable React hooks for modern web development. TypeScript support, production-ready, and developer-friendly.',
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
