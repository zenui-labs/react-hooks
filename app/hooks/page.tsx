import type {Metadata} from 'next';
import {Suspense} from 'react';
import {hookList, summariesByCategory} from '@/data';
import {HookIndex} from '@/sections/hooks-index/hook-index';

export const metadata: Metadata = {
    title: 'All hooks',
    description: `Browse ${hookList.length} React hooks by category and complexity, each with a live demo and full API docs.`,
    alternates: {canonical: '/hooks'},
};

export default function Page() {
    return (
        // useSearchParams needs a Suspense boundary in a static export.
        <Suspense>
            <HookIndex groups={summariesByCategory}/>
        </Suspense>
    );
}
