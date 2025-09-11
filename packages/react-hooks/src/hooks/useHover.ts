import { useState, useCallback, RefObject } from 'react';

export function useHover<T extends HTMLElement = HTMLElement>(): [RefObject<T>, boolean] {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const ref = useCallback((node: T | null) => {
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [handleMouseEnter, handleMouseLeave]);

  return [{ current: null } as RefObject<T>, isHovered];
}