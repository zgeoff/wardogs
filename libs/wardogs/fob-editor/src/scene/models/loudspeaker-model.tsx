import { ConeGeometry } from 'three';
import { ModelBox } from './model-box';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const LEG = 1.2;
const CABIN_FLOOR = 3.6;
const CABIN_WALL = 2.1;
const HORNS = 7.1;
const EAVES = 7.8;

const horn = new ConeGeometry(0.28, 0.6, 12, 1, true);

// a loudspeaker tower: four legs on a sandbagged base, a sheet-walled cabin half way up, three
// horns under a pitched roof
export function LoudspeakerModel(props: PieceModelProps) {
  const size = props.size;
  const pitchRise = size.height - EAVES;
  const pitchRun = size.width / 2;
  const pitch = Math.atan2(pitchRise, pitchRun);
  const pitchLength = Math.hypot(pitchRise, pitchRun);

  return (
    <group>
      {[-1, 1].flatMap((side) => [
        <ModelBox
          centre={[side * (size.width / 2 - 0.18), 0.3, 0]}
          key={`bx${side}`}
          opacity={props.opacity}
          size={[0.36, 0.6, size.depth]}
          tone="sandbag"
        />,
        <ModelBox
          centre={[0, 0.3, side * (size.depth / 2 - 0.18)]}
          key={`bz${side}`}
          opacity={props.opacity}
          size={[size.width - 0.72, 0.6, 0.36]}
          tone="sandbag"
        />,
      ])}
      {[-LEG, LEG].flatMap((x) =>
        [-LEG, LEG].map((z) => (
          <ModelBox
            centre={[x, EAVES / 2, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[0.12, EAVES, 0.12]}
            tone="steel"
          />
        )),
      )}
      <ModelBox
        centre={[0, CABIN_FLOOR, 0]}
        opacity={props.opacity}
        size={[2 * LEG + 0.2, 0.1, 2 * LEG + 0.2]}
        tone="wood"
      />
      <ModelBox
        centre={[-LEG, CABIN_FLOOR + CABIN_WALL / 2, 0]}
        opacity={props.opacity}
        size={[0.05, CABIN_WALL, 2 * LEG]}
        tone="sheet"
      />
      {[-LEG, LEG].map((z) => (
        <ModelBox
          centre={[0, CABIN_FLOOR + CABIN_WALL / 2, z]}
          key={z}
          opacity={props.opacity}
          size={[2 * LEG, CABIN_WALL, 0.05]}
          tone="sheet"
        />
      ))}
      <ModelShape
        centre={[LEG + 0.2, HORNS, 0]}
        geometry={horn}
        opacity={props.opacity}
        rotation={[0, 0, -Math.PI / 2]}
        tone="brass"
      />
      {[-1, 1].map((side) => (
        <ModelShape
          centre={[0, HORNS, side * (LEG + 0.2)]}
          geometry={horn}
          key={side}
          opacity={props.opacity}
          rotation={[(side * Math.PI) / 2, 0, 0]}
          tone="brass"
        />
      ))}
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[(side * pitchRun) / 2, EAVES + pitchRise / 2, 0]}
          key={`r${side}`}
          opacity={props.opacity}
          rotation={[0, 0, -side * pitch]}
          size={[pitchLength, 0.05, size.depth - 0.4]}
          tone="steel"
        />
      ))}
    </group>
  );
}
