import {useCallback, useEffect, useRef, useState} from 'react';
import {AudioControls, AudioState} from "../types";

export function useAudio(src: string) {
    const audioRef = useRef<HTMLAudioElement>(new Audio(src));
    const [state, setState] = useState<AudioState>({
        playing: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
    });

    useEffect(() => {
        const audio = audioRef.current;

        const updateState = () => {
            setState({
                playing: !audio.paused,
                currentTime: audio.currentTime,
                duration: audio.duration || 0,
                volume: audio.volume,
            });
        };

        audio.addEventListener('timeupdate', updateState);
        audio.addEventListener('play', updateState);
        audio.addEventListener('pause', updateState);
        audio.addEventListener('volumechange', updateState);

        return () => {
            audio.pause();
            audio.removeEventListener('timeupdate', updateState);
            audio.removeEventListener('play', updateState);
            audio.removeEventListener('pause', updateState);
            audio.removeEventListener('volumechange', updateState);
        };
    }, [src]);

    const play = useCallback(() => audioRef.current.play(), []);
    const pause = useCallback(() => audioRef.current.pause(), []);
    const stop = useCallback(() => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
    }, []);
    const setVolume = useCallback((volume: number) => {
        audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
    }, []);
    const setTime = useCallback((time: number) => {
        audioRef.current.currentTime = Math.min(Math.max(time, 0), audioRef.current.duration || 0);
    }, []);

    return {
        ...state,
        audioRef,
        controls: {play, pause, stop, setVolume, setTime} as AudioControls,
    };
}
