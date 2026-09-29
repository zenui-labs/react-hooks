import {RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AudioControls, AudioState} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

const MEDIA_EVENTS = [
    'play', 'pause', 'playing', 'timeupdate', 'volumechange', 'loadedmetadata',
    'durationchange', 'ended', 'emptied', 'seeked',
] as const;

const INITIAL_STATE: AudioState = {
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    ended: false,
};

function readState(audio: HTMLAudioElement): AudioState {
    return {
        playing: !audio.paused && !audio.ended,
        currentTime: audio.currentTime,
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
        volume: audio.volume,
        muted: audio.muted,
        ended: audio.ended,
    };
}

function sameState(a: AudioState, b: AudioState) {
    return a.playing === b.playing && a.currentTime === b.currentTime && a.duration === b.duration
        && a.volume === b.volume && a.muted === b.muted && a.ended === b.ended;
}

function noop() {
}

/**
 * Play a sound and track its playback state without rendering anything.
 * The hook creates an `Audio` element on the client. You can also attach
 * `audioRef` to a rendered `<audio>` element. Playback stops on unmount.
 * @example
 * const {playing, currentTime, duration, controls} = useAudio('/sounds/chime.mp3');
 * <button onClick={controls.play}>Play</button>
 */
export function useAudio(src: string) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ownedRef = useRef<HTMLAudioElement | null>(null);
    const [element, setElement] = useState<HTMLAudioElement | null>(null);
    const [state, setState] = useState<AudioState>(INITIAL_STATE);

    // After every commit, use the rendered <audio> if there is one, otherwise a detached element.
    useIsomorphicLayoutEffect(() => {
        if (!isBrowser) return;

        let audio = audioRef.current;
        if (!audio) {
            if (!ownedRef.current) {
                ownedRef.current = new Audio();
                ownedRef.current.preload = 'metadata';
            }
            audio = ownedRef.current;
            audioRef.current = audio;
        }
        if (audio !== element) setElement(audio);
    });

    useEffect(() => {
        if (!element) return;

        const update = () => {
            const next = readState(element);
            setState(prev => (sameState(prev, next) ? prev : next));
        };

        update();
        MEDIA_EVENTS.forEach(event => element.addEventListener(event, update));

        return () => {
            MEDIA_EVENTS.forEach(event => element.removeEventListener(event, update));
            element.pause();
        };
    }, [element]);

    useEffect(() => {
        if (!element || element.getAttribute('src') === src) return;
        if (src) {
            element.src = src;
        } else {
            element.removeAttribute('src');
            element.load();
        }
    }, [element, src]);

    // Release the network connection and decoder held by the detached element.
    useEffect(() => () => {
        const owned = ownedRef.current;
        if (owned) {
            owned.pause();
            owned.removeAttribute('src');
            owned.load();
        }
    }, []);

    const getAudio = useCallback(() => audioRef.current ?? ownedRef.current, []);

    const play = useCallback((): Promise<void> => {
        const promise = getAudio()?.play();
        if (!promise) return Promise.resolve();
        // Autoplay policies can reject play(). Attach a handler so it is never unhandled.
        promise.catch(noop);
        return promise;
    }, [getAudio]);

    const pause = useCallback(() => getAudio()?.pause(), [getAudio]);

    const stop = useCallback(() => {
        const audio = getAudio();
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }, [getAudio]);

    const setVolume = useCallback((volume: number) => {
        const audio = getAudio();
        if (audio) audio.volume = Math.min(Math.max(volume, 0), 1);
    }, [getAudio]);

    const setTime = useCallback((time: number) => {
        const audio = getAudio();
        if (!audio) return;
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        audio.currentTime = Math.min(Math.max(time, 0), duration);
    }, [getAudio]);

    const toggleMute = useCallback(() => {
        const audio = getAudio();
        if (audio) audio.muted = !audio.muted;
    }, [getAudio]);

    const controls = useMemo<AudioControls>(
        () => ({play, pause, stop, setVolume, setTime, toggleMute}),
        [play, pause, stop, setVolume, setTime, toggleMute]
    );

    return {
        ...state,
        audioRef: audioRef as RefObject<HTMLAudioElement>,
        controls,
    };
}
