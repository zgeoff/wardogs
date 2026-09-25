import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import type { PieceModelProps } from './types';

const DECK = 0.15;
const BAGS = 0.45;

// a missile launcher on a pedestal with a gunner's seat, on a sandbagged timber deck, its reload
// crate along one side
export function TalonModel(props: PieceModelProps) {
  const size = props.size;
  const edge = size.width / 2 - 0.18;
  const launcherY = size.height - 0.12;

  return (
    <group>
      <ModelBox
        centre={[0, DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="wood"
      />
      {[-1, 1].flatMap((side) => [
        <ModelBox
          centre={[side * edge, DECK + BAGS / 2, 0]}
          key={`x${side}`}
          opacity={props.opacity}
          size={[0.36, BAGS, size.depth]}
          tone="sandbag"
        />,
        <ModelBox
          centre={[0, DECK + BAGS / 2, side * edge]}
          key={`z${side}`}
          opacity={props.opacity}
          size={[size.width - 0.72, BAGS, 0.36]}
          tone="sandbag"
        />,
      ])}
      <ModelBox
        centre={[-0.9, DECK + 0.25, 0]}
        opacity={props.opacity}
        size={[0.5, 0.45, 2.2]}
        tone="drab"
      />
      <ModelCylinder
        centre={[0.1, (DECK + launcherY) / 2, 0]}
        length={launcherY - DECK}
        opacity={props.opacity}
        radius={0.06}
        tone="tank"
      />
      <ModelCylinder
        centre={[0.1, launcherY, 0]}
        length={1.9}
        opacity={props.opacity}
        radius={0.08}
        rotation={[0, 0, Math.PI / 2]}
        tone="tank"
      />
      <ModelBox
        centre={[0.4, launcherY, 0.28]}
        opacity={props.opacity}
        size={[0.3, 0.22, 0.3]}
        tone="steel"
      />
      <ModelBox
        centre={[0.3, DECK + 0.55, -0.45]}
        opacity={props.opacity}
        size={[0.4, 0.06, 0.35]}
        tone="steel"
      />
    </group>
  );
}
