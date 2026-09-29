import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {unoptimized: true},
    turbopack: {root: dirname(fileURLToPath(import.meta.url))},
};

export default nextConfig;
