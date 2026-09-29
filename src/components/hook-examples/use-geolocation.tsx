'use client'

import {useState} from 'react';
import {MapPin} from 'lucide-react';
import {useGeolocation} from '@zenuilabs/react-hooks';
import {Button, Led, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

function Tracker({highAccuracy}: { highAccuracy: boolean }) {
    const {latitude, longitude, accuracy, timestamp, loading, error, isSupported} = useGeolocation({
        enableHighAccuracy: highAccuracy,
        maximumAge: 10000,
    });

    if (!isSupported) return <Unsupported api="navigator.geolocation"/>;

    return (
        <div className="space-y-3">
            <Row>
                <Led on={loading} label={loading ? 'Waiting for a fix' : 'Watching position'}/>
                {error && <Led on tone="danger" label="Error"/>}
            </Row>
            <ReadoutGrid>
                <Readout label="latitude" value={latitude?.toFixed(5) ?? 'null'} tone={latitude !== null ? 'signal' : 'default'}/>
                <Readout label="longitude" value={longitude?.toFixed(5) ?? 'null'} tone={longitude !== null ? 'signal' : 'default'}/>
                <Readout label="accuracy" value={accuracy !== null ? `${Math.round(accuracy)} m` : 'null'}/>
                <Readout label="loading" value={String(loading)} live={loading}/>
                <Readout label="timestamp" value={timestamp ? new Date(timestamp).toLocaleTimeString() : 'null'}/>
                <Readout label="error" value={error ?? 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>
        </div>
    );
}

export default function UseGeolocationDemo() {
    const [started, setStarted] = useState(false);
    const [highAccuracy, setHighAccuracy] = useState(false);

    return (
        <Stage>
            <StageHeader
                title="Where am I"
                hint="The hook asks for permission when it mounts, so this demo waits for your click. Deny the prompt to see the error path."
                live={started}
            />
            <div className="space-y-4">
                <Row>
                    <Button onClick={() => setStarted(!started)}>
                        <MapPin size={16}/> {started ? 'Stop watching' : 'Find my location'}
                    </Button>
                    <Button variant="secondary" onClick={() => setHighAccuracy(!highAccuracy)}>
                        enableHighAccuracy: {String(highAccuracy)}
                    </Button>
                </Row>
                {started ? <Tracker highAccuracy={highAccuracy}/> : (
                    <Note>Nothing is requested until you click. Your position stays in this browser tab.</Note>
                )}
            </div>
        </Stage>
    );
}
