import { GunPit } from './gun-pit';
import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import type { PieceModelProps } from './types';

const DECK = 0.25;
const TILT = Math.PI / 4.5;
const TUBE = 1.1;

// a light mortar in a sandbagged pit: base plate, tube, and bipod
export function MortarModel(props: PieceModelProps) {
  const tubeCentreX = (Math.sin(TILT) * TUBE) / 2;
  const tubeCentreY = DECK + 0.05 + (Math.cos(TILT) * TUBE) / 2;

  return (
    <group>
      <GunPit opacity={props.opacity} size={props.size} />
      <ModelCylinder
        centre={[0, DECK + 0.03, 0]}
        length={0.06}
        opacity={props.opacity}
        radius={0.28}
        tone="tank"
      />
      <ModelCylinder
        centre={[tubeCentreX, tubeCentreY, 0]}
        length={TUBE}
        opacity={props.opacity}
        radius={0.05}
        rotation={[0, 0, -TILT]}
        tone="tank"
      />
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[0.55, DECK + 0.3, side * 0.2]}
          key={side}
          opacity={props.opacity}
          rotation={[side * 0.35, 0, 0.3]}
          size={[0.03, 0.65, 0.03]}
          tone="tank"
        />
      ))}
    </group>
  );
}
