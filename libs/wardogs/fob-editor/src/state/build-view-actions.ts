import type { EditorAPI, EditorActions } from './types';

type ViewActions = Pick<
  EditorActions,
  'loadPlan' | 'renamePlan' | 'requestFrame' | 'setCameraMode' | 'setViewStage'
>;

// which plan is open, what it is called, and how it is shown
export function buildViewActions(api: EditorAPI): ViewActions {
  return {
    loadPlan: (document) => {
      api.set({
        documentID: document.id,
        name: document.name,
        revision: 0,
        plan: document.plan,
        past: [],
        future: [],
        selection: new Set(),
        viewStage: document.plan.stageCount,
        gesture: null,
        frameRequest: api.get().frameRequest + 1,
      });
    },
    renamePlan: (name) => {
      api.set({ name, revision: api.get().revision + 1 });
    },
    setViewStage: (stage) => {
      setViewStage(api, stage);
    },
    setCameraMode: (mode) => {
      api.set({ cameraMode: mode });
    },
    requestFrame: () => {
      api.set({ frameRequest: api.get().frameRequest + 1 });
    },
  };
}

// a stage change hides later pieces, so they also leave the selection
function setViewStage(api: EditorAPI, stage: number): void {
  const state = api.get();
  const viewStage = Math.min(Math.max(1, stage), state.plan.stageCount);
  const visiblePieces = state.plan.pieces.filter((piece) => piece.stage <= viewStage);

  const visible = new Set(visiblePieces.map((piece) => piece.id));
  const selection = new Set([...state.selection].filter((id) => visible.has(id)));

  api.set({ viewStage, selection });
}
