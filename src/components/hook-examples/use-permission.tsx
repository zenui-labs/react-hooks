'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Bell, Camera, MapPin, Mic} from 'lucide-react';
import {type PermissionQueryName, usePermission} from '@zenuilabs/react-hooks';
import {Button, Led, Log, Note, Stage, StageHeader} from '@/components/demo';

type Item = {
    name: PermissionQueryName;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    ask: () => Promise<unknown>;
};

const stopStream = (stream: MediaStream) => stream.getTracks().forEach((track) => track.stop());

const ITEMS: Item[] = [
    {
        name: 'geolocation',
        label: 'Location',
        icon: MapPin,
        ask: () => new Promise((resolve) => navigator.geolocation.getCurrentPosition(resolve, resolve)),
    },
    {
        name: 'notifications',
        label: 'Notifications',
        icon: Bell,
        ask: () => ('Notification' in window ? Notification.requestPermission() : Promise.resolve()),
    },
    {
        name: 'camera',
        label: 'Camera',
        icon: Camera,
        ask: () => navigator.mediaDevices.getUserMedia({video: true}).then(stopStream).catch(() => undefined),
    },
    {
        name: 'microphone',
        label: 'Microphone',
        icon: Mic,
        ask: () => navigator.mediaDevices.getUserMedia({audio: true}).then(stopStream).catch(() => undefined),
    },
];

const TONE: Record<string, string> = {
    granted: 'text-ok',
    denied: 'text-danger',
    prompt: 'text-ink',
    unsupported: 'text-ink-3',
};

function PermissionCard({item, onChange}: { item: Item; onChange: (entry: string) => void }) {
    const state = usePermission(item.name);
    const previous = useRef<string | null>(null);
    const Icon = item.icon;

    useEffect(() => {
        if (previous.current !== null && previous.current !== state) {
            onChange(`${item.name}: ${previous.current} -> ${state}`);
        }
        previous.current = state;
    }, [state, item.name, onChange]);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper/70 p-4">
            <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                    <Icon className="size-4 text-ink-2"/>
                    {item.label}
                </span>
                <Led on={state === 'granted'} tone={state === 'denied' ? 'danger' : undefined}/>
            </div>
            <div className={`font-mono text-lg ${TONE[state]}`}>{state}</div>
            <Button
                size="sm"
                variant="secondary"
                disabled={state !== 'prompt'}
                onClick={() => void item.ask()}
            >
                {state === 'prompt' ? 'Ask' : state === 'granted' ? 'Allowed' : 'Not askable'}
            </Button>
        </div>
    );
}

export default function UsePermissionDemo() {
    const [log, setLog] = useState<string[]>([]);
    const onChange = React.useCallback((entry: string) => {
        setLog((prev) => [`${new Date().toLocaleTimeString()}  ${entry}`, ...prev].slice(0, 20));
    }, []);

    return (
        <Stage>
            <StageHeader
                title="Permission board"
                hint="Each card calls usePermission for one name. Click Ask, answer the browser prompt, and watch the state change without a reload."
            />
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {ITEMS.map((item) => (
                    <PermissionCard key={item.name} item={item} onChange={onChange}/>
                ))}
            </div>
            <div className="mt-4">
                <Log entries={log} empty="Changes appear here, including ones you make in site settings."/>
            </div>
            <Note className="mt-3">
                Reset a permission from the lock icon in the address bar. The card updates live because the hook
                listens to the PermissionStatus change event. Some browsers do not know every name and report
                unsupported.
            </Note>
        </Stage>
    );
}
