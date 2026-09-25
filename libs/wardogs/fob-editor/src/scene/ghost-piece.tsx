import { Edges } from '@react-three/drei';
import { addPlacedPiece, hasCollision } from '@wardogs-love/fob';
import type { PlacedPiece } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import { useEditorStore } from '../state/editor-store';
import { findGhostCell } from '../state/find-ghost-cell';
import { categoryColors, sceneColors } from './category-colors';
import { getPieceTransform } from './get-piece-transform';
import { skipRaycast } from './skip-raycast';

// the picked piece under the pointer, centred on it and snapped to the grid, or a copy on every
// cell of a paint stroke in progress; red where a copy would intersect a placed piece
export function GhostPiece() {
  const palettePieceID = useEditorStore((state) => state.palettePieceID);
  const pointer = useEditorStore((state) => state.pointer);
  const rotation = useEditorStore((state) => state.ghostRotation);
  const paint = useEditorStore((state) => state.paint);

  // selected only to re-render when the plan changes or the player lifts the ghost
  useEditorStore((state) => state.plan);
  useEditorStore((state) => state.ghostLift);

  const cell = findGhostCell(palettePieceID, rotation, pointer);
  const cells = paint?.cells ?? (cell === null ? [] : [cell]);
  const state = useEditorStore.getState();

  return (
    <group name="ghost">
      {cells.map((each) => {
        const ghost = state.buildGhost(each);

        return ghost === null ? null : <GhostBox ghost={ghost} key={`${each.x}:${each.z}`} />;
      })}
    </group>
  );
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
