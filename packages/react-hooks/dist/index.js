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
  useClickOutside: () => useClickOutside,
  useCopyToClipboard: () => useCopyToClipboard,
  useCounter: () => useCounter,
  useDebounce: () => useDebounce,
  useFetch: () => useFetch,
  useHover: () => useHover,
  useInterval: () => useInterval,
  useLocalStorage: () => useLocalStorage,
  useToggle: () => useToggle,
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
  return [storedValue, setValue];
}

// src/hooks/useDebounce.ts
var import_react2 = require("react");
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = (0, import_react2.useState)(value);
  (0, import_react2.useEffect)(() => {
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
var import_react3 = require("react");
function useToggle(initialValue = false) {
  const [value, setValue] = (0, import_react3.useState)(initialValue);
  const toggle = (0, import_react3.useCallback)(() => setValue((v) => !v), []);
  const setTrue = (0, import_react3.useCallback)(() => setValue(true), []);
  const setFalse = (0, import_react3.useCallback)(() => setValue(false), []);
  return [value, { toggle, setTrue, setFalse }];
}

// src/hooks/useCounter.ts
var import_react4 = require("react");
function useCounter(initialValue = 0) {
  const [count, setCount] = (0, import_react4.useState)(initialValue);
  const increment = (0, import_react4.useCallback)(() => setCount((x) => x + 1), []);
  const decrement = (0, import_react4.useCallback)(() => setCount((x) => x - 1), []);
  const reset = (0, import_react4.useCallback)(() => setCount(initialValue), [initialValue]);
  const set = (0, import_react4.useCallback)((value) => setCount(value), []);
  return [count, { increment, decrement, reset, set }];
}

// src/hooks/useFetch.ts
var import_react5 = require("react");
function useFetch(url) {
  const [data, setData] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(true);
  const [error, setError] = (0, import_react5.useState)(null);
  (0, import_react5.useEffect)(() => {
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
var import_react6 = require("react");
function useHover() {
  const [isHovered, setIsHovered] = (0, import_react6.useState)(false);
  const handleMouseEnter = (0, import_react6.useCallback)(() => setIsHovered(true), []);
  const handleMouseLeave = (0, import_react6.useCallback)(() => setIsHovered(false), []);
  const ref = (0, import_react6.useCallback)((node) => {
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
var import_react7 = require("react");
function useClickOutside(ref, handler) {
  (0, import_react7.useEffect)(() => {
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
var import_react8 = require("react");
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = (0, import_react8.useState)(false);
  const copyToClipboard = (0, import_react8.useCallback)(async (text) => {
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
var import_react9 = require("react");
function useInterval(callback, delay) {
  const savedCallback = (0, import_react9.useRef)();
  (0, import_react9.useEffect)(() => {
    savedCallback.current = callback;
  }, [callback]);
  (0, import_react9.useEffect)(() => {
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
var import_react10 = require("react");
function useWindowSize() {
  const [windowSize, setWindowSize] = (0, import_react10.useState)({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });
  (0, import_react10.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map