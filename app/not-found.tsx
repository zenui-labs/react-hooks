import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-[60dvh] max-w-[1320px] flex-col items-start justify-center px-4 py-24 sm:px-6">
            <p className="font-mono text-sm text-ink-3">404</p>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.03em] text-ink">This page does not exist.</h1>
            <p className="mt-4 max-w-md text-ink-2">The hook may have been renamed. Search with ⌘K or browse the full list.</p>
            <Link href="/hooks" className="mt-8 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-accent hover:text-accent-ink">
                Browse hooks
            </Link>
        </div>
    );
}
