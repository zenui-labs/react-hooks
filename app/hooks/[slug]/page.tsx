import {hooksData} from "@/data";
import HookDetails from "@/sections/hooks/hook-details";

export async function generateStaticParams() {
    return Object.keys(hooksData).map((slug) => ({slug}));
}

export default function Page({params}: { params: { slug: string } }) {
    return <HookDetails slug={params.slug}/>;
}
