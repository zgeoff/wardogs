import type { PlacedPiece, Plan, Rotation } from '@wardogs-love/fob';

type Tool = 'select' | 'place';

type CameraMode = 'top' | 'orbit';

export interface GroundPoint {
  readonly x: number;
  readonly z: number;
}

// a left-button drag in select mode: a box select from empty ground, or a move from a selected piece
export interface Gesture {
  readonly kind: 'box' | 'drag';
  readonly start: GroundPoint;
  readonly additive: boolean;
}

export interface CellOffset {
  readonly x: number;
  readonly z: number;
}

export interface EditorState {
  readonly documentID: string;
  readonly name: string;

  // counts edits to the plan or its name since load, so the autosave knows there is work to keep
  readonly revision: number;
  readonly plan: Plan;
  readonly past: readonly Plan[];
  readonly future: readonly Plan[];
  readonly tool: Tool;
  readonly palettePieceID: string | null;
  readonly ghostRotation: Rotation;

  // metres the player lifted the ghost above where it would rest
  readonly ghostLift: number;
  readonly selection: ReadonlySet<string>;

  // the stage on screen: pieces of later stages hide, and new pieces join this stage
  readonly viewStage: number;
  readonly cameraMode: CameraMode;

  // bumps each time the player asks to frame the base, so the camera rig reacts even to a repeat
  readonly frameRequest: number;

  // where the pointer meets the ground, in metres, while it is over the scene
  readonly pointer: GroundPoint | null;
  readonly gesture: Gesture | null;
}

export interface LoadedPlan {
  readonly id: string;
  readonly name: string;
  readonly plan: Plan;
}

export type SelectMode = 'replace' | 'toggle';

export interface EditorActions {
  readonly loadPlan: (document: LoadedPlan) => void;
  readonly renamePlan: (name: string) => void;
  readonly pickPiece: (pieceID: string) => void;
  readonly cancelTool: () => void;
  readonly resetTool: () => void;
  readonly pickSelectedPiece: () => boolean;
  readonly buildGhost: (cell: CellOffset) => PlacedPiece | null;
  readonly placePiece: (cell: CellOffset) => boolean;
  readonly rotateGhost: () => void;
  readonly liftGhost: (metres: number) => void;
  readonly selectPieces: (ids: readonly string[], mode: SelectMode) => void;
  readonly selectAllVisible: () => void;
  readonly clearSelection: () => void;
  readonly moveSelection: (offset: CellOffset, metres: number) => boolean;
  readonly rotateSelection: () => boolean;
  readonly removeSelection: () => void;
  readonly setSelectionStage: (stage: number) => void;
  readonly addStage: () => void;
  readonly removeStage: (stage: number) => void;
  readonly setViewStage: (stage: number) => void;
  readonly setCameraMode: (mode: CameraMode) => void;
  readonly requestFrame: () => void;
  readonly setPointer: (point: GroundPoint | null) => void;
  readonly startGesture: (gesture: Gesture) => void;
  readonly endGesture: () => void;
  readonly undo: () => void;
  readonly redo: () => void;
}

export type EditorStore = EditorState & EditorActions;

// what an action module needs from the store: read the whole state, write part of it
export interface EditorAPI {
  readonly get: () => EditorStore;
  readonly set: (partial: Partial<EditorState>) => void;
}
