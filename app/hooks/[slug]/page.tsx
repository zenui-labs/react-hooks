import HookDetailPage from "@/components/hook-details";
import {hooksData} from "@/data";

export async function generateStaticParams() {
  return Object.keys(hooksData).map((slug) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <HookDetailPage slug={params.slug} />;
}
