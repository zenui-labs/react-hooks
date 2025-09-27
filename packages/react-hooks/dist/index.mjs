// src/hooks/useLocalStorage.ts
import { useState } from "react";
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  return { storedValue, setValue };
}

// src/hooks/useSessionStorage.ts
import { useCallback, useEffect, useState as useState2 } from "react";
function useSessionStorage(key, initialValue) {
  const getValue = () => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  };
  const [value, setValue] = useState2(getValue);
  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, value]);
  const remove = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  return { value, setValue, remove };
}

// src/hooks/useDebounce.ts
import { useEffect as useEffect2, useState as useState3 } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState3(value);
  useEffect2(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// src/hooks/useThrottle.ts
import { useEffect as useEffect3, useRef, useState as useState4 } from "react";
function useThrottle(value, delay = 300) {
  const [throttledValue, setThrottledValue] = useState4(value);
  const lastRun = useRef(Date.now());
  useEffect3(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, delay - (Date.now() - lastRun.current));
    return () => clearTimeout(handler);
  }, [value, delay]);
  return throttledValue;
}

// src/hooks/useToggle.ts
import { useCallback as useCallback2, useState as useState5 } from "react";
function useToggle(initialValue = false) {
  const [value, setValue] = useState5(initialValue);
  const toggle = useCallback2(() => setValue((v) => !v), []);
  const setTrue = useCallback2(() => setValue(true), []);
  const setFalse = useCallback2(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}

// src/hooks/useCounter.ts
import { useCallback as useCallback3, useState as useState6 } from "react";
function useCounter(initialValue = 0) {
  const [count, setCount] = useState6(initialValue);
  const increment = useCallback3(() => setCount((x) => x + 1), []);
  const decrement = useCallback3(() => setCount((x) => x - 1), []);
  const reset = useCallback3(() => setCount(initialValue), [initialValue]);
  const set = useCallback3((value) => setCount(value), []);
  return { count, increment, decrement, reset, set };
}

// src/hooks/useFetch.ts
import { useEffect as useEffect4, useState as useState7 } from "react";
function useFetch(url) {
  const [data, setData] = useState7(null);
  const [loading, setLoading] = useState7(true);
  const [error, setError] = useState7(null);
  useEffect4(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, loading, error };
}

// src/hooks/useAsync.ts
import { useCallback as useCallback4, useEffect as useEffect5, useRef as useRef2, useState as useState8 } from "react";
function useAsync(asyncFunction, immediate = true) {
  const [state, setState] = useState8({
    loading: immediate,
    error: null,
    data: null
  });
  const isMounted = useRef2(true);
  useEffect5(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const execute = useCallback4(async (...args) => {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await asyncFunction(...args);
      if (isMounted.current) {
        setState({ loading: false, error: null, data });
      }
      return data;
    } catch (error) {
      if (isMounted.current) {
        setState({ loading: false, error, data: null });
      }
      return null;
    }
  }, [asyncFunction]);
  const reset = useCallback4(() => {
    if (isMounted.current) {
      setState({ loading: false, error: null, data: null });
    }
  }, []);
  useEffect5(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { ...state, execute, reset };
}

// src/hooks/useAsyncRetry.ts
import { useCallback as useCallback5, useEffect as useEffect6, useRef as useRef3, useState as useState9 } from "react";
function useAsyncRetry(asyncFunction, immediate = true, maxRetries = 3, retryDelay = 1e3) {
  const [state, setState] = useState9({
    loading: immediate,
    error: null,
    data: null,
    attempts: 0
  });
  const isMounted = useRef3(true);
  useEffect6(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const execute = useCallback5(async (...args) => {
    let attempt = 0;
    setState({ loading: true, error: null, data: null, attempts: attempt });
    while (attempt < maxRetries) {
      try {
        const data = await asyncFunction(...args);
        if (isMounted.current) {
          setState({ loading: false, error: null, data, attempts: attempt + 1 });
        }
        return data;
      } catch (error) {
        attempt += 1;
        if (attempt >= maxRetries) {
          if (isMounted.current) {
            setState({ loading: false, error, data: null, attempts: attempt });
          }
          return null;
        }
        await new Promise((res) => setTimeout(res, retryDelay));
      }
    }
    return null;
  }, [asyncFunction, maxRetries, retryDelay]);
  const reset = useCallback5(() => {
    if (isMounted.current) {
      setState({ loading: false, error: null, data: null, attempts: 0 });
    }
  }, []);
  useEffect6(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { ...state, execute, reset };
}

// src/hooks/useHover.ts
import { useEffect as useEffect7, useRef as useRef4, useState as useState10 } from "react";
function useHover() {
  const [isHovered, setIsHovered] = useState10(false);
  const ref = useRef4(null);
  useEffect7(() => {
    const node = ref.current;
    if (!node) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref.current]);
  return { ref, isHovered };
}

// src/hooks/useClickOutside.ts
import { useEffect as useEffect8 } from "react";
function useClickOutside(ref, handler) {
  useEffect8(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// src/hooks/useCopyToClipboard.ts
import { useCallback as useCallback6, useState as useState11 } from "react";
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState11(false);
  const copyToClipboard = useCallback6(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2e3);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      setIsCopied(false);
    }
  }, []);
  return { isCopied, copyToClipboard };
}

// src/hooks/useInterval.ts
import { useEffect as useEffect9, useRef as useRef5 } from "react";
function useInterval(callback, delay) {
  const savedCallback = useRef5();
  useEffect9(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect9(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// src/hooks/useWindowSize.ts
import { useEffect as useEffect10, useState as useState12 } from "react";
function useWindowSize() {
  const [windowSize, setWindowSize] = useState12({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });
  useEffect10(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

// src/hooks/useGeolocation.ts
import { useEffect as useEffect11, useState as useState13 } from "react";
function useGeolocation() {
  const [position, setPosition] = useState13({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null
  });
  useEffect11(() => {
    if (!navigator.geolocation) {
      setPosition((prev) => ({ ...prev, error: "Geolocation is not supported by your browser." }));
      return;
    }
    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setPosition({ latitude, longitude, accuracy, error: null });
    };
    const error = (err) => {
      setPosition((prev) => ({ ...prev, error: err.message }));
    };
    const watcherId = navigator.geolocation.watchPosition(success, error);
    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);
  return { ...position };
}

// src/hooks/useHash.ts
import { useCallback as useCallback7, useEffect as useEffect12, useState as useState14 } from "react";
function useHash() {
  const [hash, setHash] = useState14(() => window.location.hash);
  useEffect12(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const updateHash = useCallback7((newHash) => {
    if (!newHash.startsWith("#")) {
      window.location.hash = `#${newHash}`;
    } else {
      window.location.hash = newHash;
    }
  }, []);
  return { hash, setHash: updateHash };
}

// src/hooks/useIdle.ts
import { useEffect as useEffect13, useState as useState15 } from "react";
function useIdle(timeout = 6e4) {
  const [isIdle, setIsIdle] = useState15(false);
  useEffect13(() => {
    let timer;
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), timeout);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout]);
  return { isIdle };
}

// src/hooks/useIntersection.ts
import { useEffect as useEffect14, useRef as useRef6, useState as useState16 } from "react";
function useIntersection(options = {}) {
  const ref = useRef6(null);
  const [isIntersecting, setIsIntersecting] = useState16(false);
  useEffect14(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [options]);
  return { ref, isIntersecting };
}

// src/hooks/useKeyPress.ts
import { useEffect as useEffect15, useState as useState17 } from "react";
function useKeyPress(targetKey) {
  const [pressed, setPressed] = useState17(false);
  const downHandler = (event) => {
    if (event.key === targetKey) {
      setPressed(true);
    }
  };
  const upHandler = (event) => {
    if (event.key === targetKey) {
      setPressed(false);
    }
  };
  useEffect15(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);
  return pressed;
}

// src/hooks/useLocation.ts
import { useEffect as useEffect16, useState as useState18 } from "react";
function useLocation() {
  const getLocation = () => ({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash
  });
  const [location, setLocation] = useState18(getLocation);
  useEffect16(() => {
    const handleChange = () => setLocation(getLocation());
    window.addEventListener("popstate", handleChange);
    window.addEventListener("hashchange", handleChange);
    return () => {
      window.removeEventListener("popstate", handleChange);
      window.removeEventListener("hashchange", handleChange);
    };
  }, []);
  return location;
}

// src/hooks/useLockBodyScroll.ts
import { useLayoutEffect } from "react";
function useLockBodyScroll(lock = true) {
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (lock) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}

// src/hooks/useLongPress.ts
import { useCallback as useCallback8, useEffect as useEffect17, useRef as useRef7, useState as useState19 } from "react";
function useLongPress(callback, { delay = 500, onStart, onEnd } = {}) {
  const [longPressTriggered, setLongPressTriggered] = useState19(false);
  const timeout = useRef7(null);
  const start = useCallback8(() => {
    onStart?.();
    timeout.current = setTimeout(() => {
      callback();
      setLongPressTriggered(true);
    }, delay);
  }, [callback, delay, onStart]);
  const clear = useCallback8(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    if (longPressTriggered) {
      onEnd?.();
      setLongPressTriggered(false);
    }
  }, [longPressTriggered, onEnd]);
  useEffect17(() => {
    return () => clear();
  }, [clear]);
  const bind = {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear
  };
  return bind;
}

// src/hooks/useMedia.ts
import { useEffect as useEffect18, useState as useState20 } from "react";
function useMedia(query, defaultState = false) {
  const [matches, setMatches] = useState20(defaultState);
  useEffect18(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);
  return { matches };
}

// src/hooks/useMediaDevices.ts
import { useEffect as useEffect19, useState as useState21 } from "react";
function useMediaDevices() {
  const [devices, setDevices] = useState21([]);
  useEffect19(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.warn("MediaDevices API not supported in this browser.");
      return;
    }
    const updateDevices = async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        setDevices(list);
      } catch (error) {
        console.error("Error fetching media devices:", error);
      }
    };
    updateDevices();
    navigator.mediaDevices.addEventListener("devicechange", updateDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", updateDevices);
    };
  }, []);
  return { devices };
}

// src/hooks/useMouse.ts
import { useEffect as useEffect20, useState as useState22 } from "react";
function useMouse(ref) {
  const [position, setPosition] = useState22({ x: 0, y: 0 });
  useEffect20(() => {
    const handleMouseMove = (event) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      } else {
        setPosition({
          x: event.clientX,
          y: event.clientY
        });
      }
    };
    const target = ref?.current || window;
    target.addEventListener("mousemove", handleMouseMove);
    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
    };
  }, [ref]);
  return position;
}

// src/hooks/useMouseWheel.ts
import { useEffect as useEffect21, useState as useState23 } from "react";
function useMouseWheel(ref) {
  const [wheelData, setWheelData] = useState23({
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0
  });
  useEffect21(() => {
    const target = ref?.current || window;
    const handleWheel = (event) => {
      const e = event;
      setWheelData({
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ
      });
    };
    target.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      target.removeEventListener("wheel", handleWheel);
    };
  }, [ref]);
  return wheelData;
}

// src/hooks/useNetworkState.ts
import { useEffect as useEffect22, useState as useState24 } from "react";
function useNetworkState() {
  const [state, setState] = useState24({
    online: navigator.onLine,
    since: navigator.onLine ? /* @__PURE__ */ new Date() : void 0
  });
  useEffect22(() => {
    const handleOnline = () => setState({ online: true, since: /* @__PURE__ */ new Date() });
    const handleOffline = () => setState({ online: false, since: /* @__PURE__ */ new Date() });
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return state;
}

// src/hooks/usePageLeave.ts
import { useEffect as useEffect23 } from "react";
function usePageLeave(callback) {
  useEffect23(() => {
    const handleBeforeUnload = (event) => {
      callback(event);
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [callback]);
}

// src/hooks/usePrevious.ts
import { useEffect as useEffect24, useRef as useRef8 } from "react";
function usePrevious(value) {
  const ref = useRef8();
  useEffect24(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// src/hooks/useScroll.ts
import { useEffect as useEffect25, useState as useState25 } from "react";
function useScroll(ref) {
  const [scroll, setScroll] = useState25({
    x: 0,
    y: 0,
    direction: null
  });
  useEffect25(() => {
    const target = ref?.current || window;
    let lastX = 0;
    let lastY = 0;
    const handleScroll = () => {
      const x = ref?.current ? ref.current.scrollLeft : window.scrollX;
      const y = ref?.current ? ref.current.scrollTop : window.scrollY;
      let direction = null;
      if (y > lastY) direction = "down";
      else if (y < lastY) direction = "up";
      else if (x > lastX) direction = "right";
      else if (x < lastX) direction = "left";
      setScroll({ x, y, direction });
      lastX = x;
      lastY = y;
    };
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);
  return scroll;
}

// src/hooks/useSearchParam.ts
import { useCallback as useCallback9, useEffect as useEffect26, useState as useState26 } from "react";
function useSearchParam(key) {
  const getValue = () => {
    return new URLSearchParams(window.location.search).get(key);
  };
  const [value, setValue] = useState26(getValue);
  useEffect26(() => {
    const onChange = () => setValue(getValue());
    window.addEventListener("popstate", onChange);
    window.addEventListener("pushstate", onChange);
    window.addEventListener("replacestate", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("pushstate", onChange);
      window.removeEventListener("replacestate", onChange);
    };
  }, [key]);
  const setSearchParam = useCallback9((newValue) => {
    const url = new URL(window.location.href);
    if (newValue === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, newValue);
    }
    window.history.pushState({}, "", url.toString());
    setValue(newValue);
  }, [key]);
  return { value, setValue: setSearchParam };
}

// src/hooks/useDrop.ts
import { useCallback as useCallback10, useRef as useRef9, useState as useState27 } from "react";
function useDrop() {
  const ref = useRef9(null);
  const [state, setState] = useState27({ isOver: false, data: null });
  const onDragOver = useCallback10((e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isOver: true }));
  }, []);
  const onDragLeave = useCallback10(() => {
    setState((prev) => ({ ...prev, isOver: false }));
  }, []);
  const onDrop = useCallback10((e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text") || null;
    setState({ isOver: false, data });
  }, []);
  return { ref, ...state, handlers: { onDragOver, onDragLeave, onDrop } };
}

// src/hooks/useDropArea.ts
import { useCallback as useCallback11, useRef as useRef10, useState as useState28 } from "react";
function useDropArea() {
  const ref = useRef10(null);
  const [state, setState] = useState28({ isOver: false, files: [] });
  const onDragOver = useCallback11((e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isOver: true }));
  }, []);
  const onDragLeave = useCallback11(() => {
    setState((prev) => ({ ...prev, isOver: false }));
  }, []);
  const onDrop = useCallback11((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setState({ isOver: false, files });
  }, []);
  return { ref, ...state, handlers: { onDragOver, onDragLeave, onDrop } };
}

// src/hooks/useVideo.ts
import { useCallback as useCallback12, useEffect as useEffect27, useRef as useRef11, useState as useState29 } from "react";
function useVideo(src) {
  const videoRef = useRef11(document.createElement("video"));
  const [state, setState] = useState29({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false
  });
  useEffect27(() => {
    const video = videoRef.current;
    video.src = src;
    const updateState = () => {
      setState({
        playing: !video.paused,
        currentTime: video.currentTime,
        duration: video.duration || 0,
        volume: video.volume,
        muted: video.muted
      });
    };
    video.addEventListener("timeupdate", updateState);
    video.addEventListener("play", updateState);
    video.addEventListener("pause", updateState);
    video.addEventListener("volumechange", updateState);
    return () => {
      video.pause();
      video.removeEventListener("timeupdate", updateState);
      video.removeEventListener("play", updateState);
      video.removeEventListener("pause", updateState);
      video.removeEventListener("volumechange", updateState);
    };
  }, [src]);
  const play = useCallback12(() => videoRef.current.play(), []);
  const pause = useCallback12(() => videoRef.current.pause(), []);
  const stop = useCallback12(() => {
    const video = videoRef.current;
    video.pause();
    video.currentTime = 0;
  }, []);
  const setVolume = useCallback12((volume) => {
    videoRef.current.volume = Math.min(Math.max(volume, 0), 1);
  }, []);
  const setTime = useCallback12((time) => {
    const video = videoRef.current;
    video.currentTime = Math.min(Math.max(time, 0), video.duration || 0);
  }, []);
  const toggleMute = useCallback12(() => {
    videoRef.current.muted = !videoRef.current.muted;
  }, []);
  return {
    ...state,
    videoRef,
    controls: { play, pause, stop, setVolume, setTime, toggleMute }
  };
}

// src/hooks/useAudio.ts
import { useCallback as useCallback13, useEffect as useEffect28, useRef as useRef12, useState as useState30 } from "react";
function useAudio(src) {
  const audioRef = useRef12(new Audio(src));
  const [state, setState] = useState30({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1
  });
  useEffect28(() => {
    const audio = audioRef.current;
    const updateState = () => {
      setState({
        playing: !audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
        volume: audio.volume
      });
    };
    audio.addEventListener("timeupdate", updateState);
    audio.addEventListener("play", updateState);
    audio.addEventListener("pause", updateState);
    audio.addEventListener("volumechange", updateState);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateState);
      audio.removeEventListener("play", updateState);
      audio.removeEventListener("pause", updateState);
      audio.removeEventListener("volumechange", updateState);
    };
  }, [src]);
  const play = useCallback13(() => audioRef.current.play(), []);
  const pause = useCallback13(() => audioRef.current.pause(), []);
  const stop = useCallback13(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  }, []);
  const setVolume = useCallback13((volume) => {
    audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
  }, []);
  const setTime = useCallback13((time) => {
    audioRef.current.currentTime = Math.min(Math.max(time, 0), audioRef.current.duration || 0);
  }, []);
  return {
    ...state,
    audioRef,
    controls: { play, pause, stop, setVolume, setTime }
  };
}

// src/hooks/useFullscreen.tsx
import { useCallback as useCallback14, useEffect as useEffect29, useRef as useRef13, useState as useState31 } from "react";
function useFullscreen() {
  const ref = useRef13(null);
  const [isFullscreen, setIsFullscreen] = useState31(false);
  const enter = useCallback14(() => {
    if (ref.current) {
      if (ref.current.requestFullscreen) {
        ref.current.requestFullscreen();
      } else if (ref.current.webkitRequestFullscreen) {
        ref.current.webkitRequestFullscreen();
      } else if (ref.current.msRequestFullscreen) {
        ref.current.msRequestFullscreen();
      }
    }
  }, []);
  const exit = useCallback14(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);
  const toggle = useCallback14(() => {
    if (isFullscreen) exit();
    else enter();
  }, [isFullscreen, enter, exit]);
  const handleChange = useCallback14(() => {
    setIsFullscreen(document.fullscreenElement === ref.current);
  }, []);
  useEffect29(() => {
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [handleChange]);
  return { ref, isFullscreen, controls: { enter, exit, toggle } };
}

// src/hooks/useUpdate.ts
import { useCallback as useCallback15, useState as useState32 } from "react";
function useUpdate() {
  const [, setTick] = useState32(0);
  const update = useCallback15(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

// src/hooks/useVisibilityChange.ts
import { useEffect as useEffect30, useState as useState33 } from "react";
function useVisibilityChange() {
  const [state, setState] = useState33({
    visible: !document.hidden,
    hidden: document.hidden
  });
  useEffect30(() => {
    const handleVisibilityChange = () => {
      setState({
        visible: !document.hidden,
        hidden: document.hidden
      });
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return state;
}

// src/hooks/useCookie.ts
import { useCallback as useCallback16, useState as useState34 } from "react";
function useCookie(name, initialValue = "") {
  const getCookie = () => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : initialValue;
  };
  const [value, setValue] = useState34(getCookie);
  const updateCookie = useCallback16((newValue, options = {}) => {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(newValue)}`;
    if (options.path) cookieStr += `; path=${options.path}`;
    if (options.expires) cookieStr += `; expires=${options.expires.toUTCString()}`;
    if (options.maxAge) cookieStr += `; max-age=${options.maxAge}`;
    if (options.secure) cookieStr += `; secure`;
    if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
    document.cookie = cookieStr;
    setValue(newValue);
  }, [name]);
  const removeCookie = useCallback16(() => {
    document.cookie = `${encodeURIComponent(name)}=; max-age=0`;
    setValue("");
  }, [name]);
  return { value, setValue: updateCookie, remove: removeCookie };
}

// src/hooks/useEvent.ts
import { useEffect as useEffect31, useRef as useRef14 } from "react";
function useEvent(type, listener, target, options) {
  const savedListener = useRef14(listener);
  useEffect31(() => {
    savedListener.current = listener;
  }, [listener]);
  useEffect31(() => {
    const targetElement = target && "current" in target ? target.current : window;
    if (!targetElement) return;
    const eventListener = (event) => savedListener.current(event);
    targetElement.addEventListener(type, eventListener, options);
    return () => {
      targetElement.removeEventListener(type, eventListener, options);
    };
  }, [type, target, options]);
}
export {
  useAsync,
  useAsyncRetry,
  useAudio,
  useClickOutside,
  useCookie,
  useCopyToClipboard,
  useCounter,
  useDebounce,
  useDrop,
  useDropArea,
  useEvent,
  useFetch,
  useFullscreen,
  useGeolocation,
  useHash,
  useHover,
  useIdle,
  useIntersection,
  useInterval,
  useKeyPress,
  useLocalStorage,
  useLocation,
  useLockBodyScroll,
  useLongPress,
  useMedia,
  useMediaDevices,
  useMouse,
  useMouseWheel,
  useNetworkState,
  usePageLeave,
  usePrevious,
  useScroll,
  useSearchParam,
  useSessionStorage,
  useThrottle,
  useToggle,
  useUpdate,
  useVideo,
  useVisibilityChange,
  useWindowSize
};
//# sourceMappingURL=index.mjs.map