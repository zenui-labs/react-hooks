'use client'

import {useEffect, useRef, useState} from 'react';
import {Wifi, WifiOff} from 'lucide-react';
import {useNetworkState} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';
import {Log, Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

export default function UseNetworkStateDemo() {
    const {online, since, effectiveType, downlink, rtt, saveData} = useNetworkState();
    const [log, setLog] = useState<string[]>([]);
    const previous = useRef<boolean | null>(null);

    useEffect(() => {
        if (!since) return;
        if (previous.current !== null && previous.current !== online) {
            setLog((entries) => [`${since.toLocaleTimeString()}  ${online ? 'back online' : 'went offline'}`, ...entries].slice(0, 8));
        }
        previous.current = online;
    }, [online, since]);

    return (
        <Stage>
            <StageHeader
                title="Pull the plug"
                hint="Turn off Wi-Fi, or open DevTools and set the network to Offline. Connection details appear in Chromium browsers."
                live={online}
            />
            <div className="space-y-4">
                <div
                    className={cn(
                        'flex items-center gap-3 rounded-xl border px-4 py-5 font-display text-2xl font-semibold tracking-tight transition-colors',
                        online ? 'border-line bg-paper text-ink' : 'border-danger/40 bg-panel-2 text-danger'
                    )}
                >
                    {online ? <Wifi size={24}/> : <WifiOff size={24}/>}
                    {online ? 'Online' : 'Offline'}
                </div>
                <ReadoutGrid>
                    <Readout label="online" value={String(online)} live={online}/>
                    <Readout label="since" value={since ? since.toLocaleTimeString() : 'undefined'}/>
                    <Readout label="effectiveType" value={effectiveType ?? 'undefined'} tone={effectiveType ? 'signal' : 'default'}/>
                    <Readout label="downlink" value={downlink !== undefined ? `${downlink} Mbps` : 'undefined'}/>
                    <Readout label="rtt" value={rtt !== undefined ? `${rtt} ms` : 'undefined'}/>
                    <Readout label="saveData" value={saveData !== undefined ? String(saveData) : 'undefined'}/>
                </ReadoutGrid>
                <Log entries={log} empty="No changes yet."/>
                <Note>online only means the device has a network. It does not prove a server is reachable.</Note>
            </div>
        </Stage>
    );
}
