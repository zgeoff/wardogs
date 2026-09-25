import { buildDragOffset } from './build-drag-offset';
import { collectPiecesInBox } from './collect-pieces-in-box';
import type {
  CellOffset,
  EditorAPI,
  EditorActions,
  EditorStore,
  Gesture,
  GroundPoint,
  SelectMode,
} from './types';

type SelectionActions = Pick<
  EditorActions,
  | 'clearSelection'
  | 'endGesture'
  | 'selectAllVisible'
  | 'selectPieces'
  | 'setPointer'
  | 'startGesture'
>;

// what the select tool picks, and the drags that box-select or move the picked pieces
export function buildSelectionActions(api: EditorAPI): SelectionActions {
  return {
    selectPieces: (ids, mode) => {
      selectPieces(api, ids, mode);
    },
    selectAllVisible: () => {
      const state = api.get();
      const visible = state.plan.pieces.filter((piece) => piece.stage <= state.viewStage);

      api.set({ selection: new Set(visible.map((piece) => piece.id)) });
    },
    clearSelection: () => {
      api.set({ selection: new Set() });
    },
    setPointer: (point) => {
      api.set({ pointer: point });
    },
    startGesture: (gesture) => {
      api.set({ gesture });
    },
    endGesture: () => {
      endGesture(api);
    },
  };
}

function selectPieces(api: EditorAPI, ids: readonly string[], mode: SelectMode): void {
  if (mode === 'replace') {
    api.set({ selection: new Set(ids) });

    return;
  }

  const selection = new Set(api.get().selection);

  for (const id of ids) {
    if (selection.has(id)) {
      selection.delete(id);
    } else {
      selection.add(id);
    }
  }

  api.set({ selection });
}

// a drag moves the selection by the cells it covered; a box selects the pieces it touches
function endGesture(api: EditorAPI): void {
  const state = api.get();
  const gesture = state.gesture;

  api.set({ gesture: null });

  if (gesture === null || state.pointer === null) {
    return;
  }

  if (gesture.kind === 'drag') {
    moveSelectionBy(state, buildDragOffset(gesture.start, state.pointer));

    return;
  }

  selectPiecesInBox(api, gesture, state.pointer);
}

function selectPiecesInBox(api: EditorAPI, gesture: Gesture, pointer: GroundPoint): void {
  const state = api.get();
  const rect = { corner: gesture.start, opposite: pointer };
  const mode: SelectMode = gesture.additive ? 'toggle' : 'replace';

  selectPieces(api, collectPiecesInBox(state.plan, state.viewStage, rect), mode);
}

function moveSelectionBy(state: EditorStore, offset: CellOffset): void {
  if (offset.x !== 0 || offset.z !== 0) {
    state.moveSelection(offset, 0);
  }
}
