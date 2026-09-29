'use client'

import React, {useState} from 'react';
import {Pause, Play, Square, Volume2} from 'lucide-react';
import {useSpeechSynthesis} from '@zenuilabs/react-hooks';
import {Button, Field, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Textarea, Unsupported} from '@/components/demo';

function Slider({label, value, min, max, step, onChange}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}) {
    return (
        <Field label={`${label}  ${value.toFixed(1)}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-accent"
            />
        </Field>
    );
}

export default function UseSpeechSynthesisDemo() {
    const {isSupported, voices, speaking, paused, speak, pause, resume, cancel} = useSpeechSynthesis();
    const [text, setText] = useState('Your train to Lisbon leaves from platform four in twelve minutes.');
    const [voiceURI, setVoiceURI] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    const voice = voices.find((v) => v.voiceURI === voiceURI) ?? null;

    return (
        <Stage>
            <StageHeader
                title="Read it aloud"
                hint="Pick a voice, set rate and pitch, then press Speak. Pause and resume while it talks."
                live={speaking && !paused}
            />

            {!isSupported ? (
                <Unsupported api="window.speechSynthesis"/>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Text">
                            <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}/>
                        </Field>
                        <div className="space-y-3">
                            <Field label={`Voice (${voices.length} loaded)`}>
                                <select
                                    value={voiceURI}
                                    onChange={(e) => setVoiceURI(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-line-strong bg-paper px-3 text-sm text-ink outline-none focus:border-accent"
                                >
                                    <option value="">Browser default</option>
                                    {voices.map((v) => (
                                        <option key={v.voiceURI} value={v.voiceURI}>
                                            {v.name} ({v.lang}){v.localService ? '' : ' online'}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Slider label="Rate" value={rate} min={0.5} max={2} step={0.1} onChange={setRate}/>
                            <Slider label="Pitch" value={pitch} min={0} max={2} step={0.1} onChange={setPitch}/>
                        </div>
                    </div>

                    <Row className="mt-4">
                        <Button onClick={() => speak(text, {voice, rate, pitch})} disabled={!text.trim()}>
                            <Volume2 className="size-4"/>
                            Speak
                        </Button>
                        {paused ? (
                            <Button variant="secondary" onClick={resume}><Play className="size-4"/>Resume</Button>
                        ) : (
                            <Button variant="secondary" onClick={pause} disabled={!speaking}><Pause className="size-4"/>Pause</Button>
                        )}
                        <Button variant="ghost" onClick={cancel} disabled={!speaking}><Square className="size-4"/>Stop</Button>
                    </Row>

                    <ReadoutGrid cols={3} className="mt-5">
                        <Readout label="speaking" value={String(speaking)} live={speaking && !paused}/>
                        <Readout label="paused" value={String(paused)} tone={paused ? 'accent' : 'default'}/>
                        <Readout label="voices" value={voices.length}/>
                    </ReadoutGrid>
                    <Note className="mt-3">
                        Voices come from your OS and browser, so the list differs per device. Chrome loads them a moment
                        after the page opens, which is why the hook listens for voiceschanged.
                    </Note>
                </>
            )}
        </Stage>
    );
}
