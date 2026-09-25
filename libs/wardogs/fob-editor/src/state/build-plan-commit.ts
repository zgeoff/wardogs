import type { Plan } from '@wardogs-love/fob';
import type { EditorState } from './types';

const HISTORY_LIMIT = 200;

// the state change for one edit to the plan: the old plan joins the undo history, the redo
// history clears, and the revision counts one more edit to save
export function buildPlanCommit(
  state: EditorState,
  plan: Plan,
  extra: Partial<EditorState> = {},
): Partial<EditorState> {
  return {
    ...extra,
    plan,
    past: [...state.past, state.plan].slice(-HISTORY_LIMIT),
    future: [],
    revision: state.revision + 1,
  };
}
