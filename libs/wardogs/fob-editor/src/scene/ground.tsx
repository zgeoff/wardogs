import type { ThreeEvent } from '@react-three/fiber';
import { useEditorStore } from '../state/editor-store';

const GROUND_SIZE = 4000;

// an invisible plane at ground level that turns pointer positions into grid actions: painting
// copies of the picked piece, or starting and ending a box select or a drag
export function Ground() {
  return (
    <mesh
      name="ground"
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshBasicMaterial depthWrite={false} opacity={0} transparent />
    </mesh>
  );
}

function handlePointerDown(event: ThreeEvent<PointerEvent>) {
  if (event.button !== 0) {
    return;
  }

  const state = useEditorStore.getState();
  const point = { x: event.point.x, z: event.point.z };

  state.setPointer(point);

  if (state.tool === 'select') {
    state.startGesture({ kind: 'box', start: point, additive: event.shiftKey });

    return;
  }

  state.startPaint(point);
}

function handlePointerMove(event: ThreeEvent<PointerEvent>) {
  const state = useEditorStore.getState();
  const point = { x: event.point.x, z: event.point.z };

  state.setPointer(point);

  if (state.paint !== null) {
    state.updatePaint(point, event.shiftKey);
  }
}

function handlePointerUp(event: ThreeEvent<PointerEvent>) {
  if (event.button !== 0) {
    return;
  }

  const state = useEditorStore.getState();

  state.setPointer({ x: event.point.x, z: event.point.z });

  if (state.paint === null) {
    state.endGesture();
  } else {
    state.endPaint();
  }
}

function handlePointerLeave() {
  useEditorStore.getState().setPointer(null);
}
