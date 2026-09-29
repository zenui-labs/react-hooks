import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsMounted} from './useIsMounted';

export interface SpeechSynthesisSpeakOptions {
    voice?: SpeechSynthesisVoice | null;
    /** 0.1 to 10. Defaults to 1. */
    rate?: number;
    /** 0 to 2. Defaults to 1. */
    pitch?: number;
    /** 0 to 1. Defaults to 1. */
    volume?: number;
    /** BCP 47 language tag. Defaults to the voice language or the page language. */
    lang?: string;
}

export interface SpeechSynthesisResult {
    /** False when `window.speechSynthesis` is missing. */
    isSupported: boolean;
    /** Installed voices. Empty until the browser finishes loading them. */
    voices: SpeechSynthesisVoice[];
    speaking: boolean;
    paused: boolean;
    /** Speak `text`, cancelling anything this hook is currently speaking. */
    speak: (text: string, options?: SpeechSynthesisSpeakOptions) => void;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
}

function getSynth(): SpeechSynthesis | null {
    return isBrowser && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

/**
 * Read text aloud with the Web Speech API. Loads the voice list (which arrives asynchronously
 * in most browsers) and tracks speaking and paused state.
 *
 * @example
 * const {isSupported, voices, speak, cancel} = useSpeechSynthesis();
 * <button onClick={() => speak('Your order is ready', {voice: voices[0], rate: 1.1})}>Read</button>
 */
export function useSpeechSynthesis(): SpeechSynthesisResult {
    const [isSupported, setIsSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    // Holding the utterance prevents Chrome from garbage collecting it mid-speech,
    // which would drop its end event.
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isMounted = useIsMounted();

    useEffect(() => {
        const synth = getSynth();
        setIsSupported(!!synth);
        if (!synth) return;

        const loadVoices = () => setVoices(synth.getVoices());
        loadVoices();
        synth.addEventListener('voiceschanged', loadVoices);

        return () => {
            synth.removeEventListener('voiceschanged', loadVoices);
            if (utteranceRef.current) {
                utteranceRef.current = null;
                synth.cancel();
            }
        };
    }, []);

    const speak = useCallback((text: string, options: SpeechSynthesisSpeakOptions = {}) => {
        const synth = getSynth();
        if (!synth) return;

        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (options.voice) utterance.voice = options.voice;
        if (options.lang) utterance.lang = options.lang;
        else if (options.voice) utterance.lang = options.voice.lang;
        utterance.rate = options.rate ?? 1;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;

        const finish = () => {
            if (utteranceRef.current !== utterance) return;
            utteranceRef.current = null;
            if (isMounted()) {
                setSpeaking(false);
                setPaused(false);
            }
        };

        utterance.onstart = () => {
            if (utteranceRef.current !== utterance || !isMounted()) return;
            setSpeaking(true);
            setPaused(false);
        };
        utterance.onpause = () => {
            if (utteranceRef.current === utterance && isMounted()) setPaused(true);
        };
        utterance.onresume = () => {
            if (utteranceRef.current === utterance && isMounted()) setPaused(false);
        };
        utterance.onend = finish;
        utterance.onerror = finish;

        utteranceRef.current = utterance;
        setSpeaking(true);
        setPaused(false);
        synth.speak(utterance);
    }, [isMounted]);

    const pause = useCallback(() => {
        const synth = getSynth();
        if (!synth || !utteranceRef.current) return;
        synth.pause();
        // Some engines (Chrome on Android) never fire the pause event.
        setPaused(true);
    }, []);

    const resume = useCallback(() => {
        const synth = getSynth();
        if (!synth) return;
        synth.resume();
        setPaused(false);
    }, []);

    const cancel = useCallback(() => {
        const synth = getSynth();
        if (!synth) return;
        utteranceRef.current = null;
        synth.cancel();
        setSpeaking(false);
        setPaused(false);
    }, []);

    return {isSupported, voices, speaking, paused, speak, pause, resume, cancel};
}
