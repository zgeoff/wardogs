import { buildEmptyPlan } from '@wardogs-love/fob';
import type { EditorState } from './types';

export function buildInitialEditorState(): EditorState {
  return {
    documentID: crypto.randomUUID(),
    name: 'Untitled FOB',
    revision: 0,
    plan: buildEmptyPlan(),
    past: [],
    future: [],
    tool: 'select',
    palettePieceID: null,
    ghostRotation: 0,
    ghostLift: 0,
    selection: new Set(),
    viewStage: 1,
    cameraMode: 'top',
    frameRequest: 0,
    pointer: null,
    gesture: null,
  };
}
