import { BoxGeometry } from 'three';
import { skipRaycast } from '../skip-raycast';
import { getModelMaterial } from './get-model-material';
import type { ModelTone } from './model-colors';
import type { Vector3Tuple } from './types';

const unitBox = new BoxGeometry(1, 1, 1);

const NO_TURN: Vector3Tuple = [0, 0, 0];

interface ModelBoxProps {
  readonly centre: Vector3Tuple;
  readonly size: Vector3Tuple;
  readonly tone: ModelTone;
  readonly opacity: number;
  readonly rotation?: Vector3Tuple;
}

// a box in a piece model, from one shared unit box scaled to size; the piece's hit box takes the
// pointer, so the model never does
export function ModelBox(props: ModelBoxProps) {
  return (
    <mesh
      geometry={unitBox}
      material={getModelMaterial(props.tone, props.opacity)}
      position={props.centre}
      raycast={skipRaycast}
      rotation={props.rotation ?? NO_TURN}
      scale={props.size}
    />
  );
}
