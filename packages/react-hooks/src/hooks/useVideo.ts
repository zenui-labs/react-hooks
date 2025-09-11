import {useCallback, useEffect, useRef, useState} from 'react';
import {VideoControls, VideoState} from "../types";

export function useVideo(src: string) {
    const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));
    const [state, setState] = useState<VideoState>({
        playing: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        muted: false,
    });

    useEffect(() => {
        const video = videoRef.current;
        video.src = src;

        const updateState = () => {
            setState({
                playing: !video.paused,
                currentTime: video.currentTime,
                duration: video.duration || 0,
                volume: video.volume,
                muted: video.muted,
            });
        };

        video.addEventListener('timeupdate', updateState);
        video.addEventListener('play', updateState);
        video.addEventListener('pause', updateState);
        video.addEventListener('volumechange', updateState);

        return () => {
            video.pause();
            video.removeEventListener('timeupdate', updateState);
            video.removeEventListener('play', updateState);
            video.removeEventListener('pause', updateState);
            video.removeEventListener('volumechange', updateState);
        };
    }, [src]);

    const play = useCallback(() => videoRef.current.play(), []);
    const pause = useCallback(() => videoRef.current.pause(), []);
    const stop = useCallback(() => {
        const video = videoRef.current;
        video.pause();
        video.currentTime = 0;
    }, []);
    const setVolume = useCallback((volume: number) => {
        videoRef.current.volume = Math.min(Math.max(volume, 0), 1);
    }, []);
    const setTime = useCallback((time: number) => {
        const video = videoRef.current;
        video.currentTime = Math.min(Math.max(time, 0), video.duration || 0);
    }, []);
    const toggleMute = useCallback(() => {
        videoRef.current.muted = !videoRef.current.muted;
    }, []);

    return {
        ...state,
        videoRef,
        controls: {play, pause, stop, setVolume, setTime, toggleMute} as VideoControls,
    };
}
