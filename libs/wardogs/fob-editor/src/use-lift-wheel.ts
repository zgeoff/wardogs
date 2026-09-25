import { CELL_SIZE } from '@wardogs-love/fob';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useEditorStore } from './state/editor-store';

// the wheel travel of one notch on a mouse; a trackpad sends many smaller events, which add up
const NOTCH = 100;

// Ctrl (or Cmd) with the wheel over the scene lifts what the player is placing, or the selection,
// a half module a notch. The listener runs in the capture phase ahead of the camera's own wheel
// zoom, and cancels the browser's page zoom.
export function useLiftWheel(scene: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const element = scene.current;
    let travel = 0;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      travel += event.deltaY;

      const notches = Math.trunc(travel / NOTCH);

      if (notches === 0) {
        return;
      }

      travel -= notches * NOTCH;

      liftBy(-notches * CELL_SIZE);
    };

    element?.addEventListener('wheel', handleWheel, { capture: true, passive: false });

    return () => {
      element?.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [scene]);
}

function liftBy(metres: number): void {
  const state = useEditorStore.getState();

  if (state.tool === 'place') {
    state.liftGhost(metres);
  } else if (state.selection.size > 0) {
    state.moveSelection({ x: 0, z: 0 }, metres);
  }
}
