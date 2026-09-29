import type {MetadataRoute} from 'next';
import {hookList} from '@/data';
import {SITE} from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {url: SITE.url, priority: 1},
        {url: `${SITE.url}/hooks`, priority: 0.9},
        ...hookList.map((hook) => ({url: `${SITE.url}/hooks/${hook.slug}`, priority: 0.7})),
    ];
}
