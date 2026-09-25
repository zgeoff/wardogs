import { Quaternion, Vector3 } from 'three';
import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const BEAM = 0.2;
const BEAM_LENGTH = 2.6;

// three beams at right angles, tipped so one corner of the frame points up and it stands on three
// ends, as a Czech hedgehog does
const tilt = new Quaternion().setFromUnitVectors(
  new Vector3(1, 1, 1).normalize(),
  new Vector3(0, 1, 0),
);

const axes = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)];

const ends = axes.map((axis) =>
  axis
    .clone()
    .multiplyScalar(BEAM_LENGTH / 2)
    .applyQuaternion(tilt),
);

const reach = new Vector3(
  Math.max(...ends.map((end) => Math.abs(end.x))),
  Math.max(...ends.map((end) => Math.abs(end.y))),
  Math.max(...ends.map((end) => Math.abs(end.z))),
);

// a steel anti-tank hedgehog, stretched to fill the piece's box
export function HedgehogModel(props: PieceModelProps) {
  const size = props.size;

  return (
    <group
      position={[0, size.height / 2, 0]}
      scale={[
        (size.width / 2 - BEAM / 2) / reach.x,
        (size.height / 2 - BEAM / 2) / reach.y,
        (size.depth / 2 - BEAM / 2) / reach.z,
      ]}
    >
      <group quaternion={tilt}>
        <ModelBox
          centre={[0, 0, 0]}
          opacity={props.opacity}
          size={[BEAM_LENGTH, BEAM, BEAM]}
          tone="steel"
        />
        <ModelBox
          centre={[0, 0, 0]}
          opacity={props.opacity}
          size={[BEAM, BEAM_LENGTH, BEAM]}
          tone="steel"
        />
        <ModelBox
          centre={[0, 0, 0]}
          opacity={props.opacity}
          size={[BEAM, BEAM, BEAM_LENGTH]}
          tone="steel"
        />
      </group>
    </group>
  );
}
