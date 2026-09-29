import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    target: 'es2019',
    external: ['react'],
    // Every hook runs on the client. The directive lets React Server Component
    // frameworks (Next.js app router) import the package without extra wrappers.
    banner: {js: '"use client";'},
})
