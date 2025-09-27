"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useAsync: () => useAsync,
  useAsyncRetry: () => useAsyncRetry,
  useAudio: () => useAudio,
  useClickOutside: () => useClickOutside,
  useCookie: () => useCookie,
  useCopyToClipboard: () => useCopyToClipboard,
  useCounter: () => useCounter,
  useDebounce: () => useDebounce,
  useDrop: () => useDrop,
  useDropArea: () => useDropArea,
  useEvent: () => useEvent,
  useFetch: () => useFetch,
  useFullscreen: () => useFullscreen,
  useGeolocation: () => useGeolocation,
  useHash: () => useHash,
  useHover: () => useHover,
  useIdle: () => useIdle,
  useIntersection: () => useIntersection,
  useInterval: () => useInterval,
  useKeyPress: () => useKeyPress,
  useLocalStorage: () => useLocalStorage,
  useLocation: () => useLocation,
  useLockBodyScroll: () => useLockBodyScroll,
  useLongPress: () => useLongPress,
  useMedia: () => useMedia,
  useMediaDevices: () => useMediaDevices,
  useMouse: () => useMouse,
  useMouseWheel: () => useMouseWheel,
  useNetworkState: () => useNetworkState,
  usePageLeave: () => usePageLeave,
  usePrevious: () => usePrevious,
  useScroll: () => useScroll,
  useSearchParam: () => useSearchParam,
  useSessionStorage: () => useSessionStorage,
  useThrottle: () => useThrottle,
  useToggle: () => useToggle,
  useUpdate: () => useUpdate,
  useVideo: () => useVideo,
  useVisibilityChange: () => useVisibilityChange,
  useWindowSize: () => useWindowSize
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useLocalStorage.ts
var import_react = require("react");
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = (0, import_react.useState)(() => {
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
var import_react2 = require("react");
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
  const [value, setValue] = (0, import_react2.useState)(getValue);
  (0, import_react2.useEffect)(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, value]);
  const remove = (0, import_react2.useCallback)(() => {
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
var import_react3 = require("react");
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = (0, import_react3.useState)(value);
  (0, import_react3.useEffect)(() => {
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
var import_react4 = require("react");
function useThrottle(value, delay = 300) {
  const [throttledValue, setThrottledValue] = (0, import_react4.useState)(value);
  const lastRun = (0, import_react4.useRef)(Date.now());
  (0, import_react4.useEffect)(() => {
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
var import_react5 = require("react");
function useToggle(initialValue = false) {
  const [value, setValue] = (0, import_react5.useState)(initialValue);
  const toggle = (0, import_react5.useCallback)(() => setValue((v) => !v), []);
  const setTrue = (0, import_react5.useCallback)(() => setValue(true), []);
  const setFalse = (0, import_react5.useCallback)(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}

// src/hooks/useCounter.ts
var import_react6 = require("react");
function useCounter(initialValue = 0) {
  const [count, setCount] = (0, import_react6.useState)(initialValue);
  const increment = (0, import_react6.useCallback)(() => setCount((x) => x + 1), []);
  const decrement = (0, import_react6.useCallback)(() => setCount((x) => x - 1), []);
  const reset = (0, import_react6.useCallback)(() => setCount(initialValue), [initialValue]);
  const set = (0, import_react6.useCallback)((value) => setCount(value), []);
  return { count, increment, decrement, reset, set };
}

// src/hooks/useFetch.ts
var import_react7 = require("react");
function useFetch(url) {
  const [data, setData] = (0, import_react7.useState)(null);
  const [loading, setLoading] = (0, import_react7.useState)(true);
  const [error, setError] = (0, import_react7.useState)(null);
  (0, import_react7.useEffect)(() => {
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
var import_react8 = require("react");
function useAsync(asyncFunction, immediate = true) {
  const [state, setState] = (0, import_react8.useState)({
    loading: immediate,
    error: null,
    data: null
  });
  const isMounted = (0, import_react8.useRef)(true);
  (0, import_react8.useEffect)(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const execute = (0, import_react8.useCallback)(async (...args) => {
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
  const reset = (0, import_react8.useCallback)(() => {
    if (isMounted.current) {
      setState({ loading: false, error: null, data: null });
    }
  }, []);
  (0, import_react8.useEffect)(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { ...state, execute, reset };
}

// src/hooks/useAsyncRetry.ts
var import_react9 = require("react");
function useAsyncRetry(asyncFunction, immediate = true, maxRetries = 3, retryDelay = 1e3) {
  const [state, setState] = (0, import_react9.useState)({
    loading: immediate,
    error: null,
    data: null,
    attempts: 0
  });
  const isMounted = (0, import_react9.useRef)(true);
  (0, import_react9.useEffect)(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const execute = (0, import_react9.useCallback)(async (...args) => {
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
  const reset = (0, import_react9.useCallback)(() => {
    if (isMounted.current) {
      setState({ loading: false, error: null, data: null, attempts: 0 });
    }
  }, []);
  (0, import_react9.useEffect)(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { ...state, execute, reset };
}

// src/hooks/useHover.ts
var import_react10 = require("react");
function useHover() {
  const [isHovered, setIsHovered] = (0, import_react10.useState)(false);
  const ref = (0, import_react10.useRef)(null);
  (0, import_react10.useEffect)(() => {
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
var import_react11 = require("react");
function useClickOutside(ref, handler) {
  (0, import_react11.useEffect)(() => {
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
var import_react12 = require("react");
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = (0, import_react12.useState)(false);
  const copyToClipboard = (0, import_react12.useCallback)(async (text) => {
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
var import_react13 = require("react");
function useInterval(callback, delay) {
  const savedCallback = (0, import_react13.useRef)();
  (0, import_react13.useEffect)(() => {
    savedCallback.current = callback;
  }, [callback]);
  (0, import_react13.useEffect)(() => {
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
var import_react14 = require("react");
function useWindowSize() {
  const [windowSize, setWindowSize] = (0, import_react14.useState)({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });
  (0, import_react14.useEffect)(() => {
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
var import_react15 = require("react");
function useGeolocation() {
  const [position, setPosition] = (0, import_react15.useState)({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null
  });
  (0, import_react15.useEffect)(() => {
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
var import_react16 = require("react");
function useHash() {
  const [hash, setHash] = (0, import_react16.useState)(() => window.location.hash);
  (0, import_react16.useEffect)(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const updateHash = (0, import_react16.useCallback)((newHash) => {
    if (!newHash.startsWith("#")) {
      window.location.hash = `#${newHash}`;
    } else {
      window.location.hash = newHash;
    }
  }, []);
  return { hash, setHash: updateHash };
}

// src/hooks/useIdle.ts
var import_react17 = require("react");
function useIdle(timeout = 6e4) {
  const [isIdle, setIsIdle] = (0, import_react17.useState)(false);
  (0, import_react17.useEffect)(() => {
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
var import_react18 = require("react");
function useIntersection(options = {}) {
  const ref = (0, import_react18.useRef)(null);
  const [isIntersecting, setIsIntersecting] = (0, import_react18.useState)(false);
  (0, import_react18.useEffect)(() => {
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
var import_react19 = require("react");
function useKeyPress(targetKey) {
  const [pressed, setPressed] = (0, import_react19.useState)(false);
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
  (0, import_react19.useEffect)(() => {
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
var import_react20 = require("react");
function useLocation() {
  const getLocation = () => ({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash
  });
  const [location, setLocation] = (0, import_react20.useState)(getLocation);
  (0, import_react20.useEffect)(() => {
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
var import_react21 = require("react");
function useLockBodyScroll(lock = true) {
  (0, import_react21.useLayoutEffect)(() => {
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
var import_react22 = require("react");
function useLongPress(callback, { delay = 500, onStart, onEnd } = {}) {
  const [longPressTriggered, setLongPressTriggered] = (0, import_react22.useState)(false);
  const timeout = (0, import_react22.useRef)(null);
  const start = (0, import_react22.useCallback)(() => {
    onStart?.();
    timeout.current = setTimeout(() => {
      callback();
      setLongPressTriggered(true);
    }, delay);
  }, [callback, delay, onStart]);
  const clear = (0, import_react22.useCallback)(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    if (longPressTriggered) {
      onEnd?.();
      setLongPressTriggered(false);
    }
  }, [longPressTriggered, onEnd]);
  (0, import_react22.useEffect)(() => {
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
var import_react23 = require("react");
function useMedia(query, defaultState = false) {
  const [matches, setMatches] = (0, import_react23.useState)(defaultState);
  (0, import_react23.useEffect)(() => {
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
var import_react24 = require("react");
function useMediaDevices() {
  const [devices, setDevices] = (0, import_react24.useState)([]);
  (0, import_react24.useEffect)(() => {
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
var import_react25 = require("react");
function useMouse(ref) {
  const [position, setPosition] = (0, import_react25.useState)({ x: 0, y: 0 });
  (0, import_react25.useEffect)(() => {
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
var import_react26 = require("react");
function useMouseWheel(ref) {
  const [wheelData, setWheelData] = (0, import_react26.useState)({
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0
  });
  (0, import_react26.useEffect)(() => {
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
var import_react27 = require("react");
function useNetworkState() {
  const [state, setState] = (0, import_react27.useState)({
    online: navigator.onLine,
    since: navigator.onLine ? /* @__PURE__ */ new Date() : void 0
  });
  (0, import_react27.useEffect)(() => {
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
var import_react28 = require("react");
function usePageLeave(callback) {
  (0, import_react28.useEffect)(() => {
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
var import_react29 = require("react");
function usePrevious(value) {
  const ref = (0, import_react29.useRef)();
  (0, import_react29.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// src/hooks/useScroll.ts
var import_react30 = require("react");
function useScroll(ref) {
  const [scroll, setScroll] = (0, import_react30.useState)({
    x: 0,
    y: 0,
    direction: null
  });
  (0, import_react30.useEffect)(() => {
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
var import_react31 = require("react");
function useSearchParam(key) {
  const getValue = () => {
    return new URLSearchParams(window.location.search).get(key);
  };
  const [value, setValue] = (0, import_react31.useState)(getValue);
  (0, import_react31.useEffect)(() => {
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
  const setSearchParam = (0, import_react31.useCallback)((newValue) => {
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
var import_react32 = require("react");
function useDrop() {
  const ref = (0, import_react32.useRef)(null);
  const [state, setState] = (0, import_react32.useState)({ isOver: false, data: null });
  const onDragOver = (0, import_react32.useCallback)((e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isOver: true }));
  }, []);
  const onDragLeave = (0, import_react32.useCallback)(() => {
    setState((prev) => ({ ...prev, isOver: false }));
  }, []);
  const onDrop = (0, import_react32.useCallback)((e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text") || null;
    setState({ isOver: false, data });
  }, []);
  return { ref, ...state, handlers: { onDragOver, onDragLeave, onDrop } };
}

// src/hooks/useDropArea.ts
var import_react33 = require("react");
function useDropArea() {
  const ref = (0, import_react33.useRef)(null);
  const [state, setState] = (0, import_react33.useState)({ isOver: false, files: [] });
  const onDragOver = (0, import_react33.useCallback)((e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isOver: true }));
  }, []);
  const onDragLeave = (0, import_react33.useCallback)(() => {
    setState((prev) => ({ ...prev, isOver: false }));
  }, []);
  const onDrop = (0, import_react33.useCallback)((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setState({ isOver: false, files });
  }, []);
  return { ref, ...state, handlers: { onDragOver, onDragLeave, onDrop } };
}

// src/hooks/useVideo.ts
var import_react34 = require("react");
function useVideo(src) {
  const videoRef = (0, import_react34.useRef)(document.createElement("video"));
  const [state, setState] = (0, import_react34.useState)({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false
  });
  (0, import_react34.useEffect)(() => {
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
  const play = (0, import_react34.useCallback)(() => videoRef.current.play(), []);
  const pause = (0, import_react34.useCallback)(() => videoRef.current.pause(), []);
  const stop = (0, import_react34.useCallback)(() => {
    const video = videoRef.current;
    video.pause();
    video.currentTime = 0;
  }, []);
  const setVolume = (0, import_react34.useCallback)((volume) => {
    videoRef.current.volume = Math.min(Math.max(volume, 0), 1);
  }, []);
  const setTime = (0, import_react34.useCallback)((time) => {
    const video = videoRef.current;
    video.currentTime = Math.min(Math.max(time, 0), video.duration || 0);
  }, []);
  const toggleMute = (0, import_react34.useCallback)(() => {
    videoRef.current.muted = !videoRef.current.muted;
  }, []);
  return {
    ...state,
    videoRef,
    controls: { play, pause, stop, setVolume, setTime, toggleMute }
  };
}

// src/hooks/useAudio.ts
var import_react35 = require("react");
function useAudio(src) {
  const audioRef = (0, import_react35.useRef)(new Audio(src));
  const [state, setState] = (0, import_react35.useState)({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1
  });
  (0, import_react35.useEffect)(() => {
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
  const play = (0, import_react35.useCallback)(() => audioRef.current.play(), []);
  const pause = (0, import_react35.useCallback)(() => audioRef.current.pause(), []);
  const stop = (0, import_react35.useCallback)(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  }, []);
  const setVolume = (0, import_react35.useCallback)((volume) => {
    audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
  }, []);
  const setTime = (0, import_react35.useCallback)((time) => {
    audioRef.current.currentTime = Math.min(Math.max(time, 0), audioRef.current.duration || 0);
  }, []);
  return {
    ...state,
    audioRef,
    controls: { play, pause, stop, setVolume, setTime }
  };
}

// src/hooks/useFullscreen.tsx
var import_react36 = require("react");
function useFullscreen() {
  const ref = (0, import_react36.useRef)(null);
  const [isFullscreen, setIsFullscreen] = (0, import_react36.useState)(false);
  const enter = (0, import_react36.useCallback)(() => {
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
  const exit = (0, import_react36.useCallback)(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);
  const toggle = (0, import_react36.useCallback)(() => {
    if (isFullscreen) exit();
    else enter();
  }, [isFullscreen, enter, exit]);
  const handleChange = (0, import_react36.useCallback)(() => {
    setIsFullscreen(document.fullscreenElement === ref.current);
  }, []);
  (0, import_react36.useEffect)(() => {
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [handleChange]);
  return { ref, isFullscreen, controls: { enter, exit, toggle } };
}

// src/hooks/useUpdate.ts
var import_react37 = require("react");
function useUpdate() {
  const [, setTick] = (0, import_react37.useState)(0);
  const update = (0, import_react37.useCallback)(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

// src/hooks/useVisibilityChange.ts
var import_react38 = require("react");
function useVisibilityChange() {
  const [state, setState] = (0, import_react38.useState)({
    visible: !document.hidden,
    hidden: document.hidden
  });
  (0, import_react38.useEffect)(() => {
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
var import_react39 = require("react");
function useCookie(name, initialValue = "") {
  const getCookie = () => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : initialValue;
  };
  const [value, setValue] = (0, import_react39.useState)(getCookie);
  const updateCookie = (0, import_react39.useCallback)((newValue, options = {}) => {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(newValue)}`;
    if (options.path) cookieStr += `; path=${options.path}`;
    if (options.expires) cookieStr += `; expires=${options.expires.toUTCString()}`;
    if (options.maxAge) cookieStr += `; max-age=${options.maxAge}`;
    if (options.secure) cookieStr += `; secure`;
    if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
    document.cookie = cookieStr;
    setValue(newValue);
  }, [name]);
  const removeCookie = (0, import_react39.useCallback)(() => {
    document.cookie = `${encodeURIComponent(name)}=; max-age=0`;
    setValue("");
  }, [name]);
  return { value, setValue: updateCookie, remove: removeCookie };
}

// src/hooks/useEvent.ts
var import_react40 = require("react");
function useEvent(type, listener, target, options) {
  const savedListener = (0, import_react40.useRef)(listener);
  (0, import_react40.useEffect)(() => {
    savedListener.current = listener;
  }, [listener]);
  (0, import_react40.useEffect)(() => {
    const targetElement = target && "current" in target ? target.current : window;
    if (!targetElement) return;
    const eventListener = (event) => savedListener.current(event);
    targetElement.addEventListener(type, eventListener, options);
    return () => {
      targetElement.removeEventListener(type, eventListener, options);
    };
  }, [type, target, options]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map