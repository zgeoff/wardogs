import { Edges } from '@react-three/drei';
import { addPlacedPiece, hasCollision } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import { useEditorStore } from '../state/editor-store';
import { findGhostCell } from '../state/find-ghost-cell';
import { categoryColors, sceneColors } from './category-colors';
import { getPieceTransform } from './get-piece-transform';
import { skipRaycast } from './skip-raycast';

// the picked piece under the pointer, centred on it and snapped to the grid; red where it would
// intersect a placed piece
export function GhostPiece() {
  const palettePieceID = useEditorStore((state) => state.palettePieceID);
  const pointer = useEditorStore((state) => state.pointer);
  const rotation = useEditorStore((state) => state.ghostRotation);
  const plan = useEditorStore((state) => state.plan);

  // selected only to re-render when the player lifts the ghost
  useEditorStore((state) => state.ghostLift);

  const cell = findGhostCell(palettePieceID, rotation, pointer);
  const ghost = cell === null ? null : useEditorStore.getState().buildGhost(cell);

  if (ghost === null) {
    return null;
  }

  const isBlocked = hasCollision(addPlacedPiece(plan, ghost), new Set([ghost.id]));
  const transform = getPieceTransform(ghost);
  const color = isBlocked ? sceneColors.invalid : categoryColors[getPiece(ghost.pieceID).category];

  return (
    <mesh name="ghost" position={[...transform.position]} raycast={skipRaycast}>
      <boxGeometry args={[...transform.size]} />
      <meshStandardMaterial color={color} depthWrite={false} opacity={0.55} transparent />
      <Edges color={color} />
    </mesh>
  );
}
