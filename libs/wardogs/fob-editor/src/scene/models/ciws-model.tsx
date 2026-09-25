import { SphereGeometry } from 'three';
import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const DECK = 0.5;
const RADOME = 0.45;

const dome = new SphereGeometry(RADOME, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);

// a close-in weapon system on a timber deck: base cabinet, turret, gun yoke and radome, a console,
// and an L of sandbags in one corner
export function CIWSModel(props: PieceModelProps) {
  const size = props.size;
  const turretTop = DECK + 2.3;
  const radomeBase = turretTop + 0.2;
  const radomeLength = size.height - radomeBase - RADOME - 0.02;

  return (
    <group>
      <ModelBox
        centre={[0, DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="wood"
      />
      <ModelBox centre={[0, DECK + 0.5, 0]} opacity={props.opacity} size={[2, 1, 2]} tone="grey" />
      <ModelBox
        centre={[0, DECK + 1.65, 0]}
        opacity={props.opacity}
        size={[1.3, 1.3, 1.2]}
        tone="grey"
      />
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[side * 0.6, turretTop + 0.6, 0]}
          key={side}
          opacity={props.opacity}
          size={[0.15, 1.2, 1]}
          tone="greyDark"
        />
      ))}
      <ModelCylinder
        centre={[0, radomeBase + radomeLength / 2, 0]}
        length={radomeLength}
        opacity={props.opacity}
        radius={RADOME}
        sides={16}
        tone="grey"
      />
      <ModelShape
        centre={[0, radomeBase + radomeLength, 0]}
        geometry={dome}
        opacity={props.opacity}
        tone="grey"
      />
      <ModelBox
        centre={[1.4, DECK + 0.55, 0.6]}
        opacity={props.opacity}
        size={[0.6, 1.1, 0.5]}
        tone="greyDark"
      />
      <ModelBox
        centre={[2.7, DECK + 0.2, 1]}
        opacity={props.opacity}
        size={[0.4, 0.4, 3.2]}
        tone="sandbag"
      />
      <ModelBox
        centre={[1, DECK + 0.2, 2.7]}
        opacity={props.opacity}
        size={[3, 0.4, 0.4]}
        tone="sandbag"
      />
    </group>
  );
}
