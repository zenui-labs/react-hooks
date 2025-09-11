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
  return [storedValue, setValue];
}

// src/hooks/useDebounce.ts
import { useState as useState2, useEffect as useEffect2 } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState2(value);
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

// src/hooks/useToggle.ts
import { useState as useState3, useCallback } from "react";
function useToggle(initialValue = false) {
  const [value, setValue] = useState3(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse }];
}

// src/hooks/useCounter.ts
import { useState as useState4, useCallback as useCallback2 } from "react";
function useCounter(initialValue = 0) {
  const [count, setCount] = useState4(initialValue);
  const increment = useCallback2(() => setCount((x) => x + 1), []);
  const decrement = useCallback2(() => setCount((x) => x - 1), []);
  const reset = useCallback2(() => setCount(initialValue), [initialValue]);
  const set = useCallback2((value) => setCount(value), []);
  return [count, { increment, decrement, reset, set }];
}

// src/hooks/useFetch.ts
import { useState as useState5, useEffect as useEffect3 } from "react";
function useFetch(url) {
  const [data, setData] = useState5(null);
  const [loading, setLoading] = useState5(true);
  const [error, setError] = useState5(null);
  useEffect3(() => {
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

// src/hooks/useHover.ts
import { useState as useState6, useCallback as useCallback3 } from "react";
function useHover() {
  const [isHovered, setIsHovered] = useState6(false);
  const handleMouseEnter = useCallback3(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback3(() => setIsHovered(false), []);
  const ref = useCallback3((node) => {
    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [handleMouseEnter, handleMouseLeave]);
  return [{ current: null }, isHovered];
}

// src/hooks/useClickOutside.ts
import { useEffect as useEffect4 } from "react";
function useClickOutside(ref, handler) {
  useEffect4(() => {
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
import { useState as useState7, useCallback as useCallback4 } from "react";
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState7(false);
  const copyToClipboard = useCallback4(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2e3);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      setIsCopied(false);
    }
  }, []);
  return [isCopied, copyToClipboard];
}

// src/hooks/useInterval.ts
import { useEffect as useEffect5, useRef } from "react";
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect5(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect5(() => {
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
import { useState as useState8, useEffect as useEffect6 } from "react";
function useWindowSize() {
  const [windowSize, setWindowSize] = useState8({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });
  useEffect6(() => {
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
export {
  useClickOutside,
  useCopyToClipboard,
  useCounter,
  useDebounce,
  useFetch,
  useHover,
  useInterval,
  useLocalStorage,
  useToggle,
  useWindowSize
};
//# sourceMappingURL=index.mjs.map