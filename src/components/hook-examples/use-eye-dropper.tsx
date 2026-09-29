'use client'

import React, {useState} from 'react';
import {Check, Pipette, Trash2} from 'lucide-react';
import {useEyeDropper} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

export default function UseEyeDropperDemo() {
    const {isSupported, color, error, open} = useEyeDropper();
    const [palette, setPalette] = useState<string[]>([]);
    const [copied, setCopied] = useState<string | null>(null);

    const pick = async () => {
        const picked = await open();
        if (picked) setPalette((prev) => [picked, ...prev.filter((c) => c !== picked)].slice(0, 8));
    };

    const copy = async (hex: string) => {
        await navigator.clipboard.writeText(hex);
        setCopied(hex);
        setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
    };

    return (
        <Stage>
            <StageHeader
                title="Palette builder"
                hint="Press Pick, then click any pixel on your screen, including other windows. Escape cancels. Click a swatch to copy its hex."
            />

            {!isSupported ? (
                <Unsupported api="window.EyeDropper"/>
            ) : (
                <>
                    <Row>
                        <Button onClick={pick}><Pipette className="size-4"/>Pick a color</Button>
                        <Button variant="ghost" onClick={() => setPalette([])} disabled={palette.length === 0}>
                            <Trash2 className="size-4"/>Clear
                        </Button>
                    </Row>

                    <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
                        {Array.from({length: 8}, (_, i) => palette[i]).map((hex, i) =>
                            hex ? (
                                <button
                                    key={hex}
                                    type="button"
                                    onClick={() => copy(hex)}
                                    className="group relative aspect-square rounded-xl border border-line-strong"
                                    style={{background: hex}}
                                    title={`Copy ${hex}`}
                                >
                                    <span className="absolute inset-x-1 bottom-1 rounded bg-paper/85 px-1 py-0.5 font-mono text-[10px] text-ink">
                                        {copied === hex ? <Check className="mx-auto size-3"/> : hex}
                                    </span>
                                </button>
                            ) : (
                                <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-line-strong"/>
                            )
                        )}
                    </div>

                    <ReadoutGrid cols={2} className="mt-5">
                        <Readout
                            label="color"
                            value={
                                <span className="inline-flex items-center gap-2">
                                    {color && <span className="size-4 rounded border border-line-strong" style={{background: color}}/>}
                                    {color ?? 'null'}
                                </span>
                            }
                        />
                        <Readout label="error" value={error ? error.message : 'null'} tone={error ? 'danger' : 'default'}/>
                    </ReadoutGrid>
                    <Note className="mt-3">Chrome and Edge on desktop support the EyeDropper API.</Note>
                </>
            )}
        </Stage>
    );
}
