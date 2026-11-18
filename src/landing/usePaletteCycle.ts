import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/** Index that advances every `intervalMs`. Stays on `start` when the visitor prefers reduced motion. */
export function useCycle(length: number, intervalMs: number, start = 0): number {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(start);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(id);
  }, [length, intervalMs, reduceMotion]);

  return index;
}
