'use client'

import {Pause, Play, Square, Volume2, VolumeX} from 'lucide-react';
import {useVideo} from '@zenuilabs/react-hooks';
import {Button, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

export default function UseVideoDemo() {
    const {videoRef, playing, currentTime, duration, volume, muted, ended, controls} = useVideo(SRC);

    return (
        <Stage>
            <StageHeader
                title="A custom video player"
                hint="The video element has no native controls. Every button calls the hook and every readout comes from its state."
                live={playing}
            />
            <div className="space-y-4">
                <video
                    ref={videoRef}
                    playsInline
                    onClick={playing ? controls.pause : controls.play}
                    className="aspect-video w-full cursor-pointer rounded-xl border border-line bg-panel-2 object-cover"
                />
                <input
                    type="range"
                    aria-label="Seek"
                    min={0}
                    max={duration || 0}
                    step={0.05}
                    value={currentTime}
                    onChange={(e) => controls.setTime(Number(e.target.value))}
                    className="w-full accent-accent"
                />
                <Row>
                    <Button onClick={playing ? controls.pause : controls.play}>
                        {playing ? <Pause size={16}/> : <Play size={16}/>}
                        {playing ? 'Pause' : ended ? 'Replay' : 'Play'}
                    </Button>
                    <Button variant="secondary" onClick={controls.stop}><Square size={14}/> Stop</Button>
                    <Button variant="secondary" onClick={controls.toggleMute}>
                        {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
                        {muted ? 'Unmute' : 'Mute'}
                    </Button>
                    <input
                        type="range"
                        aria-label="Volume"
                        min={0}
                        max={1}
                        step={0.05}
                        value={volume}
                        onChange={(e) => controls.setVolume(Number(e.target.value))}
                        className="w-28 accent-accent"
                    />
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="playing" value={String(playing)} live={playing}/>
                    <Readout label="time" value={`${currentTime.toFixed(1)} / ${duration.toFixed(1)}`}/>
                    <Readout label="volume" value={muted ? 'muted' : volume.toFixed(2)}/>
                    <Readout label="ended" value={String(ended)} tone={ended ? 'signal' : 'default'}/>
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
