import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import type { PieceModelProps } from './types';

const HEM = 0.25;

// a camouflage net pitched as a low ridge tent along the piece's depth
export function ReconTentModel(props: PieceModelProps) {
  const size = props.size;
  const run = size.width / 2 - 0.15;
  const rise = size.height - 0.03 - HEM;
  const slope = Math.atan2(rise, run);
  const panel = Math.hypot(run, rise);
  const length = size.depth - 0.5;

  return (
    <group>
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[(side * run) / 2, HEM + rise / 2, 0]}
          key={side}
          opacity={props.opacity}
          rotation={[0, 0, -side * slope]}
          size={[panel, 0.04, length]}
          tone="netting"
        />
      ))}
      <ModelCylinder
        centre={[0, HEM + rise, 0]}
        length={length + 0.2}
        opacity={props.opacity}
        radius={0.03}
        rotation={[Math.PI / 2, 0, 0]}
        tone="steel"
      />
    </group>
  );
}
