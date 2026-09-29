import {Hero} from '@/sections/landing/hero';
import {BeforeAfter} from '@/sections/landing/before-after';
import {Categories} from '@/sections/landing/categories';
import {NewInRelease, Popular} from '@/sections/landing/showcase';

export default function Page() {
    return (
        <>
            <Hero/>
            <Categories/>
            <BeforeAfter/>
            <Popular/>
            <NewInRelease/>
        </>
    );
}
