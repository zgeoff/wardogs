import type { BufferGeometry } from 'three';
import { skipRaycast } from '../skip-raycast';
import { getModelLineMaterial } from './get-model-line-material';
import type { ModelTone } from './model-colors';
import type { Vector3Tuple } from './types';

interface ModelTrussProps {
  readonly geometry: BufferGeometry;
  readonly base: Vector3Tuple;
  readonly tone: ModelTone;
  readonly opacity: number;
}

// a lattice tower in a piece model, drawn as lines in one draw call
export function ModelTruss(props: ModelTrussProps) {
  return (
    <lineSegments
      geometry={props.geometry}
      material={getModelLineMaterial(props.tone, props.opacity)}
      position={props.base}
      raycast={skipRaycast}
    />
  );
}
