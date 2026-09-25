import { create } from 'zustand';
import { buildEditActions } from './build-edit-actions';
import { buildInitialEditorState } from './build-initial-editor-state';
import { buildPlacementActions } from './build-placement-actions';
import { buildSelectionActions } from './build-selection-actions';
import { buildViewActions } from './build-view-actions';
import type { EditorStore } from './types';

export const useEditorStore = create<EditorStore>()((set, get) => {
  const api = { get, set };

  return {
    ...buildInitialEditorState(),
    ...buildPlacementActions(api),
    ...buildEditActions(api),
    ...buildSelectionActions(api),
    ...buildViewActions(api),
  };
});
