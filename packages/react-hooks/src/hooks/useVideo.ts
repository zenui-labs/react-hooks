import {RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {VideoControls, VideoState} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

const MEDIA_EVENTS = [
    'play', 'pause', 'playing', 'timeupdate', 'volumechange', 'loadedmetadata',
    'durationchange', 'ended', 'emptied', 'seeked',
] as const;

const INITIAL_STATE: VideoState = {
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    ended: false,
};

function readState(video: HTMLVideoElement): VideoState {
    return {
        playing: !video.paused && !video.ended,
        currentTime: video.currentTime,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        volume: video.volume,
        muted: video.muted,
        ended: video.ended,
    };
}

function sameState(a: VideoState, b: VideoState) {
    return a.playing === b.playing && a.currentTime === b.currentTime && a.duration === b.duration
        && a.volume === b.volume && a.muted === b.muted && a.ended === b.ended;
}

function noop() {
}

/**
 * Control a video and track its playback state.
 * Attach `videoRef` to a rendered `<video>` to show it. Without one, the hook creates a hidden
 * element on the client. The element is paused on unmount.
 * @example
 * const {videoRef, playing, controls} = useVideo('/intro.webm');
 * <video ref={videoRef} />
 * <button onClick={playing ? controls.pause : controls.play}>{playing ? 'Pause' : 'Play'}</button>
 */
export function useVideo(src: string) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const ownedRef = useRef<HTMLVideoElement | null>(null);
    const [element, setElement] = useState<HTMLVideoElement | null>(null);
    const [state, setState] = useState<VideoState>(INITIAL_STATE);

    // After every commit, use the rendered <video> if there is one, otherwise a detached element.
    useIsomorphicLayoutEffect(() => {
        if (!isBrowser) return;

        let video = videoRef.current;
        if (!video) {
            if (!ownedRef.current) {
                ownedRef.current = document.createElement('video');
                ownedRef.current.preload = 'metadata';
            }
            video = ownedRef.current;
            videoRef.current = video;
        }
        if (video !== element) setElement(video);
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

    const getVideo = useCallback(() => videoRef.current ?? ownedRef.current, []);

    const play = useCallback((): Promise<void> => {
        const promise = getVideo()?.play();
        if (!promise) return Promise.resolve();
        // Autoplay policies can reject play(). Attach a handler so it is never unhandled.
        promise.catch(noop);
        return promise;
    }, [getVideo]);

    const pause = useCallback(() => getVideo()?.pause(), [getVideo]);

    const stop = useCallback(() => {
        const video = getVideo();
        if (!video) return;
        video.pause();
        video.currentTime = 0;
    }, [getVideo]);

    const setVolume = useCallback((volume: number) => {
        const video = getVideo();
        if (video) video.volume = Math.min(Math.max(volume, 0), 1);
    }, [getVideo]);

    const setTime = useCallback((time: number) => {
        const video = getVideo();
        if (!video) return;
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        video.currentTime = Math.min(Math.max(time, 0), duration);
    }, [getVideo]);

    const toggleMute = useCallback(() => {
        const video = getVideo();
        if (video) video.muted = !video.muted;
    }, [getVideo]);

    const controls = useMemo<VideoControls>(
        () => ({play, pause, stop, setVolume, setTime, toggleMute}),
        [play, pause, stop, setVolume, setTime, toggleMute]
    );

    return {
        ...state,
        videoRef: videoRef as RefObject<HTMLVideoElement>,
        controls,
    };
}
