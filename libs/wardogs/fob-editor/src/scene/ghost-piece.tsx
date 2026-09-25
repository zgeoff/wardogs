import { Edges } from '@react-three/drei';
import { addPlacedPiece, hasCollision } from '@wardogs-love/fob';
import type { PlacedPiece } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import { useEditorStore } from '../state/editor-store';
import { findGhostCell } from '../state/find-ghost-cell';
import { findStampCell } from '../state/find-stamp-cell';
import type { EditorActions, EditorState } from '../state/types';
import { categoryColors, sceneColors } from './category-colors';
import { getPieceTransform } from './get-piece-transform';
import { skipRaycast } from './skip-raycast';

// the picked piece under the pointer, centred on it and snapped to the grid, a copy on every cell
// of a paint stroke in progress, or a pasted group; red where a copy would intersect a placed piece
export function GhostPiece() {
  // selected to re-render when any input to the ghosts changes; the ghosts read the store directly
  useEditorStore((state) => state.palettePieceID);
  useEditorStore((state) => state.pointer);
  useEditorStore((state) => state.ghostRotation);
  useEditorStore((state) => state.paint);
  useEditorStore((state) => state.stamp);
  useEditorStore((state) => state.plan);
  useEditorStore((state) => state.ghostLift);

  const ghosts = buildGhosts(useEditorStore.getState());

  return (
    <group name="ghost">
      {ghosts.map((ghost) => (
        <GhostBox ghost={ghost} key={`${ghost.id}:${ghost.x}:${ghost.z}`} />
      ))}
    </group>
  );
}

type GhostInput = Pick<
  EditorState,
  'ghostRotation' | 'paint' | 'palettePieceID' | 'pointer' | 'stamp'
> & {
  readonly buildGhost: EditorActions['buildGhost'];
  readonly buildStampGhosts: EditorActions['buildStampGhosts'];
};

// a pasted group centred on the pointer, the cells of a paint stroke, or the palette piece
function buildGhosts(state: GhostInput): readonly PlacedPiece[] {
  if (state.stamp !== null) {
    const cell = findStampCell(state.stamp, state.pointer);

    return cell === null ? [] : state.buildStampGhosts(cell);
  }

  const cell = findGhostCell(state.palettePieceID, state.ghostRotation, state.pointer);
  const cells = state.paint?.cells ?? (cell === null ? [] : [cell]);

  return cells.flatMap((each) => state.buildGhost(each) ?? []);
}

interface GhostBoxProps {
  readonly ghost: PlacedPiece;
}

function GhostBox(props: GhostBoxProps) {
  const plan = useEditorStore.getState().plan;
  const isBlocked = hasCollision(addPlacedPiece(plan, props.ghost), new Set([props.ghost.id]));
  const transform = getPieceTransform(props.ghost);

  const color = isBlocked
    ? sceneColors.invalid
    : categoryColors[getPiece(props.ghost.pieceID).category];

  return (
    <mesh position={[...transform.position]} raycast={skipRaycast}>
      <boxGeometry args={[...transform.size]} />
      <meshStandardMaterial color={color} depthWrite={false} opacity={0.55} transparent />
      <Edges color={color} />
    </mesh>
  );
}
