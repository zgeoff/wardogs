import { useEditorStore } from '../state/editor-store';
import { sceneColors } from './category-colors';
import { skipRaycast } from './skip-raycast';

// the rectangle of a box select in progress, flat on the ground
export function BoxSelectRect() {
  const gesture = useEditorStore((state) => state.gesture);
  const pointer = useEditorStore((state) => state.pointer);

  if (gesture?.kind !== 'box' || pointer === null) {
    return null;
  }

  const width = Math.abs(pointer.x - gesture.start.x);
  const depth = Math.abs(pointer.z - gesture.start.z);

  return (
    <mesh
      position={[(pointer.x + gesture.start.x) / 2, 0.03, (pointer.z + gesture.start.z) / 2]}
      raycast={skipRaycast}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[Math.max(width, 0.01), Math.max(depth, 0.01)]} />
      <meshBasicMaterial
        color={sceneColors.boxSelect}
        depthWrite={false}
        opacity={0.15}
        transparent
      />
    </mesh>
  );
}
