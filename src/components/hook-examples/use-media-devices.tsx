'use client'

import {Camera, Mic, Speaker} from 'lucide-react';
import {useMediaDevices} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Stage, StageHeader, Unsupported} from '@/components/demo';

const KINDS = [
    {kind: 'videoinput', label: 'Cameras', Icon: Camera},
    {kind: 'audioinput', label: 'Microphones', Icon: Mic},
    {kind: 'audiooutput', label: 'Speakers', Icon: Speaker},
] as const;

export default function UseMediaDevicesDemo() {
    const {devices, isSupported, error, requestPermission} = useMediaDevices();
    const hasLabels = devices.some((device) => device.label);

    return (
        <Stage>
            <StageHeader
                title="Your devices"
                hint="Plug in headphones or a webcam and the list refreshes. Names stay hidden until you allow camera and microphone access."
            />
            {!isSupported ? <Unsupported api="navigator.mediaDevices"/> : (
                <div className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                        {KINDS.map(({kind, label, Icon}) => {
                            const list = devices.filter((device) => device.kind === kind);
                            return (
                                <div key={kind} className="rounded-xl border border-line bg-paper/70 p-3.5">
                                    <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                                        <Icon size={14}/> {label}
                                    </div>
                                    <ul className="space-y-1 text-sm text-ink">
                                        {list.length === 0 && <li className="text-ink-3">None found</li>}
                                        {list.map((device, i) => (
                                            <li key={`${device.deviceId}-${i}`} className="truncate">
                                                {device.label || <span className="text-ink-3">Unnamed device {i + 1}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    {!hasLabels && (
                        <Button onClick={() => requestPermission()}>Allow access to show names</Button>
                    )}
                    <ReadoutGrid>
                        <Readout label="devices" value={devices.length}/>
                        <Readout label="labels" value={hasLabels ? 'visible' : 'hidden'} tone={hasLabels ? 'signal' : 'default'}/>
                        <Readout label="error" value={error ? error.name : 'null'} tone={error ? 'danger' : 'default'}/>
                    </ReadoutGrid>
                    <Note>requestPermission opens the camera and microphone for a moment, then stops both streams.</Note>
                </div>
            )}
        </Stage>
    );
}
