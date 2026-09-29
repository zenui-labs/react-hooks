'use client'

import React from 'react';
import {Zap} from 'lucide-react';
import {useBattery} from '@zenuilabs/react-hooks';
import {Note, Readout, ReadoutGrid, Stage, StageHeader, Unsupported} from '@/components/demo';
import {cn} from '@/lib/cn';

function formatSeconds(seconds: number) {
    if (!Number.isFinite(seconds)) return 'unknown';
    if (seconds === 0) return 'now';
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function UseBatteryDemo() {
    const {isSupported, level, charging, chargingTime, dischargingTime} = useBattery();
    const percent = Math.round(level * 100);
    const low = !charging && percent <= 20;

    return (
        <Stage>
            <StageHeader
                title="Battery"
                hint="Plug your laptop in or unplug it. The readings update from the Battery Status API events."
                live={isSupported}
            />

            {!isSupported ? (
                <Unsupported api="navigator.getBattery"/>
            ) : (
                <>
                    <div className="mb-6 flex items-center justify-center py-4">
                        <div className="flex items-center">
                            <div className="relative h-24 w-56 overflow-hidden rounded-2xl border-2 border-line-strong bg-paper p-1.5">
                                <div
                                    className={cn(
                                        'h-full rounded-xl transition-[width] duration-700',
                                        low ? 'bg-danger' : charging ? 'bg-signal' : 'bg-accent'
                                    )}
                                    style={{width: `${percent}%`}}
                                />
                                <div className="absolute inset-0 flex items-center justify-center gap-1.5 font-mono text-2xl font-semibold tabular-nums text-ink">
                                    {charging && <Zap className="size-5"/>}
                                    {percent}%
                                </div>
                            </div>
                            <div className="h-8 w-2 rounded-r-md bg-line-strong"/>
                        </div>
                    </div>

                    <ReadoutGrid cols={4}>
                        <Readout label="level" value={level.toFixed(2)} tone={low ? 'danger' : 'default'}/>
                        <Readout label="charging" value={String(charging)} live={charging} tone={charging ? 'ok' : 'default'}/>
                        <Readout label="chargingTime" value={formatSeconds(chargingTime)}/>
                        <Readout label="dischargingTime" value={formatSeconds(dischargingTime)}/>
                    </ReadoutGrid>
                    <Note className="mt-3">
                        Times read unknown (Infinity) until the system has an estimate. Many desktops report a
                        full, charging battery at all times.
                    </Note>
                </>
            )}
        </Stage>
    );
}
