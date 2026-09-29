'use client'

import React from 'react';
import {Monitor, Moon, Sun} from 'lucide-react';
import {type ColorSchemePreference, useColorScheme} from '@zenuilabs/react-hooks';
import {Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const OPTIONS: { value: ColorSchemePreference; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {value: 'light', label: 'Light', icon: Sun},
    {value: 'dark', label: 'Dark', icon: Moon},
    {value: 'system', label: 'System', icon: Monitor},
];

// The preview uses CSS system colors (Canvas, CanvasText, ...), which follow the
// element's color-scheme. It previews the choice without touching the site theme.
function Preview({scheme}: { scheme: 'light' | 'dark' }) {
    return (
        <div
            className="rounded-xl border p-5 transition-colors duration-300"
            style={{colorScheme: scheme, background: 'Canvas', color: 'CanvasText', borderColor: 'GrayText'}}
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold">Notifications</div>
                    <div className="text-xs" style={{color: 'GrayText'}}>Choose what reaches your inbox</div>
                </div>
                <span className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{background: 'Highlight', color: 'HighlightText'}}>
                    {scheme}
                </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> Weekly summary</label>
                <label className="flex items-center gap-2"><input type="checkbox"/> Product updates</label>
                <input type="range" defaultValue={60} className="w-full"/>
                <input
                    placeholder="Email address"
                    className="w-full rounded-md border px-2 py-1.5 text-sm"
                    style={{background: 'Field', color: 'FieldText', borderColor: 'GrayText'}}
                />
            </div>
            <button
                type="button"
                className="mt-4 rounded-md border px-3 py-1.5 text-sm"
                style={{background: 'ButtonFace', color: 'ButtonText', borderColor: 'ButtonBorder'}}
            >
                Save
            </button>
        </div>
    );
}

export default function UseColorSchemeDemo() {
    const {scheme, resolved, setScheme} = useColorScheme({storageKey: 'zenui-demo-color-scheme'});

    return (
        <Stage>
            <StageHeader
                title="Theme preference"
                hint="Pick a scheme. System follows your OS setting and switches when it does. The choice survives a reload and syncs to other open tabs."
            />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div role="radiogroup" aria-label="Color scheme" className="inline-flex rounded-xl border border-line bg-paper p-1">
                        {OPTIONS.map(({value, label, icon: Icon}) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={scheme === value}
                                onClick={() => setScheme(value)}
                                className={cn(
                                    'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm transition-colors',
                                    scheme === value ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                                )}
                            >
                                <Icon className="size-4"/>
                                {label}
                            </button>
                        ))}
                    </div>
                    <ReadoutGrid cols={2}>
                        <Readout label="scheme" value={scheme}/>
                        <Readout label="resolved" value={resolved} tone="accent"/>
                    </ReadoutGrid>
                    <Note>
                        Saved under localStorage key <span className="font-mono">zenui-demo-color-scheme</span>. Open
                        this page in a second tab and change it there to see the sync.
                    </Note>
                </div>
                <Preview scheme={resolved}/>
            </div>
        </Stage>
    );
}
