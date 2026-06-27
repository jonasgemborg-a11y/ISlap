import { useRef, useCallback } from 'react';

export type SwipeType = 'weapon' | 'skill';

export function useSwipeDetector(
  onSlap: (type: SwipeType) => void,
  threshold = 30,
) {
  const lastX   = useRef<number | null>(null);
  const lastY   = useRef<number | null>(null);
  const lastDirX = useRef<'left' | 'right' | null>(null);
  const lastDirY = useRef<'up' | 'down' | null>(null);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (lastX.current === null) {
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      return;
    }

    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current!;

    // Ignore movement below threshold on both axes
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

    // Dominant axis determines swipe type
    if (Math.abs(dx) >= Math.abs(dy)) {
      // Horizontal → weapon
      const dir = dx > 0 ? 'right' : 'left';
      if (dir !== lastDirX.current) {
        onSlap('weapon');
        lastDirX.current = dir;
      }
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      lastDirY.current = null; // reset vertical so next up-swipe registers
    } else {
      // Vertical → skill
      const dir = dy > 0 ? 'down' : 'up';
      if (dir !== lastDirY.current) {
        onSlap('skill');
        lastDirY.current = dir;
      }
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      lastDirX.current = null;
    }
  }, [onSlap, threshold]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    lastDirX.current = null;
    lastDirY.current = null;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerUp = useCallback(() => {
    lastX.current = null;
    lastY.current = null;
    lastDirX.current = null;
    lastDirY.current = null;
  }, []);

  return { onPointerMove, onPointerDown, onPointerUp };
}
