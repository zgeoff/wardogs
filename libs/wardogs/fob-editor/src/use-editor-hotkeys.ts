import { CELL_SIZE } from '@wardogs-love/fob';
import { useEffect } from 'react';
import { useEditorStore } from './state/editor-store';
import type { CellOffset, EditorStore } from './state/types';

type Hotkey = (state: EditorStore, event: KeyboardEvent) => void;

const ARROW_OFFSETS: Readonly<Record<string, CellOffset>> = {
  arrowup: { x: 0, z: -1 },
  arrowdown: { x: 0, z: 1 },
  arrowleft: { x: -1, z: 0 },
  arrowright: { x: 1, z: 0 },
};

// keys with Ctrl or Cmd held
const COMMAND_HOTKEYS: Readonly<Record<string, Hotkey>> = {
  z: (state, event) => {
    if (event.shiftKey) {
      state.redo();
    } else {
      state.undo();
    }
  },
  y: (state) => {
    state.redo();
  },
  c: (state) => {
    state.setClipboard();
  },
  v: (state) => {
    state.pickClipboard();
  },
  a: (state) => {
    state.selectAllVisible();
  },
};

const PLAIN_HOTKEYS: Readonly<Record<string, Hotkey>> = {
  escape: (state) => {
    state.resetTool();
  },

  // one piece goes on the cursor as a palette piece, so it paints; a group goes on as a stamp
  d: (state) => {
    if (state.tool !== 'select') {
      return;
    }

    if (state.selection.size > 1) {
      state.setClipboard();
      state.pickClipboard();
    } else {
      state.pickSelectedPiece();
    }
  },
  r: (state) => {
    if (state.tool === 'place') {
      state.rotateGhost();
    } else {
      state.rotateSelection();
    }
  },
  pageup: (state) => {
    liftGhostOrSelection(state, CELL_SIZE);
  },
  pagedown: (state) => {
    liftGhostOrSelection(state, -CELL_SIZE);
  },
  f: (state) => {
    state.requestFrame();
  },
  delete: (state) => {
    state.removeSelection();
  },
  backspace: (state) => {
    state.removeSelection();
  },
};

// keyboard control for the planner; keys typed into a form field stay with that field
export function useEditorHotkeys(): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const hotkey = findHotkey(event);

      if (hotkey !== undefined) {
        event.preventDefault();

        hotkey(useEditorStore.getState(), event);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}

function findHotkey(event: KeyboardEvent): Hotkey | undefined {
  const key = event.key.toLowerCase();

  if (event.ctrlKey || event.metaKey) {
    return COMMAND_HOTKEYS[key];
  }

  const offset = ARROW_OFFSETS[key];

  if (offset !== undefined) {
    return (state) => {
      if (state.tool === 'select') {
        state.moveSelection(offset, 0);
      }
    };
  }

  return PLAIN_HOTKEYS[key];
}

// PageUp and PageDown lift the ghost while placing, and raise the selection otherwise
function liftGhostOrSelection(state: EditorStore, metres: number): void {
  if (state.tool === 'place') {
    state.liftGhost(metres);
  } else {
    state.moveSelection({ x: 0, z: 0 }, metres);
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  );
}
