import {hooksData} from "@/data";
import {Metadata} from "next";
import dynamic from "next/dynamic";

const HookDetails = dynamic(() => import('@/sections/hooks/hook-details'), {
    ssr: false,
});

export async function generateStaticParams() {
    return Object.keys(hooksData).map((slug) => ({slug}));
}

export async function generateMetadata({params}: { params: { slug: string } }): Promise<Metadata> {
    const hook = hooksData[params.slug];

    if (!hook) {
        return {
            title: "Hook not found",
            description: "This hook does not exist in the library."
        };
    }

    const title = `${hook.name} - ${hook.category} Hook | ZenUI React Hooks`;
    const description = hook.description;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://react-hooks.zenui.net/hooks/${params.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        metadataBase: new URL("https://react-hooks.zenui.net"),
    };
}

export default function Page({params}: { params: { slug: string } }) {
    return <HookDetails slug={params.slug}/>;
}
