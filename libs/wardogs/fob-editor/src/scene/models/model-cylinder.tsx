import { CylinderGeometry } from 'three';
import { skipRaycast } from '../skip-raycast';
import { getModelMaterial } from './get-model-material';
import type { ModelTone } from './model-colors';
import type { Vector3Tuple } from './types';

const unitCylinders = new Map<number, CylinderGeometry>();

const UPRIGHT: Vector3Tuple = [0, 0, 0];

interface ModelCylinderProps {
  readonly centre: Vector3Tuple;
  readonly radius: number;
  readonly length: number;
  readonly tone: ModelTone;
  readonly opacity: number;
  readonly rotation?: Vector3Tuple;
  readonly sides?: number;
}

// an upright cylinder in a piece model, from one shared unit cylinder per side count; a rotation
// lays it down
export function ModelCylinder(props: ModelCylinderProps) {
  const diameter = props.radius * 2;

  return (
    <mesh
      geometry={getUnitCylinder(props.sides ?? 12)}
      material={getModelMaterial(props.tone, props.opacity)}
      position={props.centre}
      raycast={skipRaycast}
      rotation={props.rotation ?? UPRIGHT}
      scale={[diameter, props.length, diameter]}
    />
  );
}

function getUnitCylinder(sides: number): CylinderGeometry {
  const cached = unitCylinders.get(sides);

  if (cached !== undefined) {
    return cached;
  }

  const geometry = new CylinderGeometry(0.5, 0.5, 1, sides);

  unitCylinders.set(sides, geometry);

  return geometry;
}
