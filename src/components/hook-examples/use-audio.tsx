'use client'

import {Pause, Play, Square, Volume2, VolumeX} from 'lucide-react';
import {useAudio} from '@zenuilabs/react-hooks';
import {Button, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
const BARS = 24;

export default function UseAudioDemo() {
    const {playing, currentTime, duration, volume, muted, ended, controls} = useAudio(SRC);
    const progress = duration ? currentTime / duration : 0;

    return (
        <Stage>
            <StageHeader
                title="Sound without an element"
                hint="Nothing is rendered for the audio. The hook owns an Audio object and exposes its state. Click a bar to seek."
                live={playing}
            />
            <div className="space-y-4">
                <div className="flex h-20 items-end gap-1" role="group" aria-label="Seek">
                    {Array.from({length: BARS}, (_, i) => {
                        const height = 30 + Math.round(70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
                        const played = i / BARS < progress;
                        return (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Seek to ${Math.round((i / BARS) * 100)}%`}
                                onClick={() => controls.setTime((i / BARS) * duration)}
                                className={played ? 'flex-1 rounded-sm bg-accent' : 'flex-1 rounded-sm bg-panel-2 hover:bg-line-strong'}
                                style={{height: `${height}%`}}
                            />
                        );
                    })}
                </div>
                <Row>
                    <Button onClick={playing ? controls.pause : controls.play}>
                        {playing ? <Pause size={16}/> : <Play size={16}/>}
                        {playing ? 'Pause' : ended ? 'Roar again' : 'Roar'}
                    </Button>
                    <Button variant="secondary" onClick={controls.stop}><Square size={14}/> Stop</Button>
                    <Button variant="secondary" onClick={controls.toggleMute}>
                        {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
                        {muted ? 'Unmute' : 'Mute'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => controls.setVolume(volume - 0.1)}>Vol -</Button>
                    <Button variant="ghost" size="sm" onClick={() => controls.setVolume(volume + 0.1)}>Vol +</Button>
                </Row>
                <Meter label="volume" value={volume} max={1}/>
                <ReadoutGrid cols={4}>
                    <Readout label="playing" value={String(playing)} live={playing}/>
                    <Readout label="time" value={`${currentTime.toFixed(1)} / ${duration.toFixed(1)}`}/>
                    <Readout label="muted" value={String(muted)}/>
                    <Readout label="ended" value={String(ended)} tone={ended ? 'signal' : 'default'}/>
                </ReadoutGrid>
                <Note>Sample: T-rex roar, CC0, from MDN.</Note>
            </div>
        </Stage>
    );
}
