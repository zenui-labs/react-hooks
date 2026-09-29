'use client'

import {Moon, Sun} from 'lucide-react';
import {useSiteTheme} from '@/lib/theme';

export function ThemeToggle() {
    const {theme, toggle} = useSiteTheme();
    const next = theme === 'dark' ? 'light' : 'dark';

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${next} theme`}
            className="grid size-9 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-panel-2 hover:text-ink"
        >
            {theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}
        </button>
    );
}
