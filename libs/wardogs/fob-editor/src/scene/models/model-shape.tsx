import type { BufferGeometry } from 'three';
import { skipRaycast } from '../skip-raycast';
import { getModelMaterial } from './get-model-material';
import type { ModelTone } from './model-colors';
import type { Vector3Tuple } from './types';

const ORIGIN: Vector3Tuple = [0, 0, 0];

interface ModelShapeProps {
  readonly geometry: BufferGeometry;
  readonly tone: ModelTone;
  readonly opacity: number;
  readonly centre?: Vector3Tuple;
  readonly rotation?: Vector3Tuple;
}

// a piece-model part with its own shared geometry: a coil, an extruded profile, a rounded box
export function ModelShape(props: ModelShapeProps) {
  return (
    <mesh
      geometry={props.geometry}
      material={getModelMaterial(props.tone, props.opacity)}
      position={props.centre ?? ORIGIN}
      raycast={skipRaycast}
      rotation={props.rotation ?? ORIGIN}
    />
  );
}
