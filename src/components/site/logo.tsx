import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logo.svg';

export function Logo() {
    return (
        <Link href="/" className="group flex items-center gap-2.5" aria-label="ZenUI React Hooks home">
            <Image src={logo} alt="" width={28} height={28} className="size-7 transition-transform duration-300 group-hover:-rotate-12" priority/>
            <span className="font-mono text-[13px] tracking-tight text-ink">
                <span className="text-ink-3">zenui/</span>react-hooks
            </span>
        </Link>
    );
}
