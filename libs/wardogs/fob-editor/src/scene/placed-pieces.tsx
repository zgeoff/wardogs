import { Edges } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { hasCollision, isOutsideFOBArea, movePlacedPieces } from '@wardogs-love/fob';
import type { PlacedPiece, Plan } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import { buildDragOffset } from '../state/build-drag-offset';
import { useEditorStore } from '../state/editor-store';
import type { EditorState } from '../state/types';
import { categoryColors, sceneColors } from './category-colors';
import { getPieceTransform } from './get-piece-transform';
import { pieceModels } from './models/piece-models';

// every piece built by the stage on screen: earlier stages dim, the stage on screen shows solid,
// and a selection being dragged draws at its drop position
export function PlacedPieces() {
  const plan = useEditorStore((state) => state.plan);
  const viewStage = useEditorStore((state) => state.viewStage);
  const selection = useEditorStore((state) => state.selection);
  const tool = useEditorStore((state) => state.tool);
  const gesture = useEditorStore((state) => state.gesture);
  const pointer = useEditorStore((state) => state.pointer);
  const cameraMode = useEditorStore((state) => state.cameraMode);
  const dragged = findDraggedPlan({ plan, selection, gesture, pointer });
  const shownPlan = dragged ?? plan;
  const isDragBlocked = dragged !== null && hasCollision(dragged, selection);

  return (
    <group name="placed-pieces">
      {shownPlan.pieces
        .filter((piece) => piece.stage <= viewStage)
        .map((piece) => (
          <PieceMesh
            isBlocked={isDragBlocked && selection.has(piece.id)}
            isDimmed={piece.stage < viewStage}
            isOutlined={cameraMode !== 'orbit'}
            isOutside={isOutsideFOBArea(shownPlan, piece)}
            isSelectable={tool === 'select'}
            isSelected={selection.has(piece.id)}
            key={piece.id}
            piece={piece}
          />
        ))}
    </group>
  );
}

type DragInput = Pick<EditorState, 'gesture' | 'plan' | 'pointer' | 'selection'>;

// the plan as it would be if the drag in progress dropped here
function findDraggedPlan(input: DragInput): Plan | null {
  if (input.gesture?.kind !== 'drag' || input.pointer === null) {
    return null;
  }

  const offset = buildDragOffset(input.gesture.start, input.pointer);

  return movePlacedPieces(input.plan, input.selection, { ...offset, elevation: 0 });
}

interface PieceMeshProps {
  readonly piece: PlacedPiece;
  readonly isDimmed: boolean;
  readonly isSelected: boolean;
  readonly isSelectable: boolean;
  readonly isOutside: boolean;
  readonly isBlocked: boolean;
  readonly isOutlined: boolean;
}

function PieceMesh(props: PieceMeshProps) {
  const transform = getPieceTransform(props.piece);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!props.isSelectable || event.button !== 0) {
      return;
    }

    event.stopPropagation();

    const state = useEditorStore.getState();
    const isAdditive = event.shiftKey;

    if (isAdditive) {
      state.selectPieces([props.piece.id], 'toggle');

      return;
    }

    if (!state.selection.has(props.piece.id)) {
      state.selectPieces([props.piece.id], 'replace');
    }

    state.startGesture({
      kind: 'drag',
      start: { x: event.point.x, z: event.point.z },
      additive: false,
    });
  };

  const piece = getPiece(props.piece.pieceID);
  const Model = props.isBlocked ? undefined : pieceModels[piece.id];
  const edgeColor = pickEdgeColor(props, Model === undefined);

  // the group carries the pointer handler; its box takes every hit, drawn as the piece when it has
  // no model (or while a drag is blocked) and left invisible otherwise, so a click in a gap of the
  // barbed wire still selects it
  return (
    <group
      name={`piece-${props.piece.id}`}
      onPointerDown={handlePointerDown}
      position={[...transform.position]}
    >
      <mesh>
        <boxGeometry args={[...transform.size]} />
        {Model === undefined ? (
          <meshStandardMaterial
            color={props.isBlocked ? sceneColors.invalid : categoryColors[piece.category]}
            opacity={props.isDimmed ? 0.35 : 1}
            transparent={props.isDimmed}
          />
        ) : (
          <meshBasicMaterial visible={false} />
        )}
        {edgeColor === null ? null : <Edges color={edgeColor} />}
      </mesh>
      {Model === undefined ? null : (
        <group position={[0, -piece.size.height / 2, 0]} rotation={[0, transform.rotationY, 0]}>
          <Model opacity={props.isDimmed ? 0.35 : 1} size={piece.size} />
        </group>
      )}
    </group>
  );
}

// a box always has an outline, and so does a model in the top view, where the outline shows the
// piece's footprint; in the 3D view a model has one only to show it is selected or outside the FOB
// area
function pickEdgeColor(props: PieceMeshProps, isBox: boolean): string | null {
  if (props.isSelected) {
    return sceneColors.selected;
  }

  if (props.isOutside) {
    return sceneColors.outsideArea;
  }

  if (isBox) {
    return '#000000';
  }

  return props.isOutlined ? sceneColors.footprint : null;
}
