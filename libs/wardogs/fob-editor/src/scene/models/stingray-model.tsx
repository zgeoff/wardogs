import { GunPit } from './gun-pit';
import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import type { PieceModelProps } from './types';

const DECK = 0.25;
const TILT = Math.PI / 6;
const TUBE = 1.3;
const HEAD = DECK + 0.75;

// a launcher on a tripod in a sandbagged pit, its control box beside it
export function StingrayModel(props: PieceModelProps) {
  return (
    <group>
      <GunPit opacity={props.opacity} size={props.size} />
      <ModelCylinder
        centre={[0, HEAD + (Math.cos(TILT) * TUBE) / 4, 0]}
        length={TUBE}
        opacity={props.opacity}
        radius={0.1}
        rotation={[0, 0, -TILT]}
        tone="tank"
      />
      {[0, 1, 2].map((leg) => {
        const angle = (leg * 2 * Math.PI) / 3;

        return (
          <ModelBox
            centre={[Math.cos(angle) * 0.25, DECK + 0.37, Math.sin(angle) * 0.25]}
            key={leg}
            opacity={props.opacity}
            rotation={[Math.sin(angle) * 0.35, 0, -Math.cos(angle) * 0.35]}
            size={[0.03, 0.8, 0.03]}
            tone="tank"
          />
        );
      })}
      <ModelBox
        centre={[-0.6, DECK + 0.15, 0.6]}
        opacity={props.opacity}
        size={[0.35, 0.3, 0.3]}
        tone="drab"
      />
    </group>
  );
}
