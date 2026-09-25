import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import type { PieceModelProps } from './types';

const LEGS = 0.6;
const PLATFORM = 0.12;
const TANK_RADIUS = 0.6;

// a fuel tank in a timber cage beside a stack of equipment cases, on a raised steel platform
export function RefuelStationModel(props: PieceModelProps) {
  const size = props.size;
  const deck = LEGS + PLATFORM;
  const leg = size.width / 2 - 0.1;
  const cageTop = size.height - 0.05;
  const tankX = 0.35;

  return (
    <group>
      {[-leg, leg].flatMap((x) =>
        [-leg, leg].map((z) => (
          <ModelBox
            centre={[x, LEGS / 2, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[0.08, LEGS, 0.08]}
            tone="steel"
          />
        )),
      )}
      <ModelBox
        centre={[0, LEGS + PLATFORM / 2, 0]}
        opacity={props.opacity}
        size={[size.width, PLATFORM, size.depth]}
        tone="concrete"
      />
      <ModelBox
        centre={[-1, deck + 0.55, 0.2]}
        opacity={props.opacity}
        size={[0.75, 1.1, 1.2]}
        tone="rubber"
      />
      <ModelBox
        centre={[-1, deck + 1.25, 0.2]}
        opacity={props.opacity}
        size={[0.6, 0.3, 0.5]}
        tone="steel"
      />
      <ModelCylinder
        centre={[tankX, deck + TANK_RADIUS + 0.05, 0]}
        length={1.7}
        opacity={props.opacity}
        radius={TANK_RADIUS}
        rotation={[Math.PI / 2, 0, 0]}
        sides={16}
        tone="tank"
      />
      {[tankX - 0.7, tankX + 0.7].flatMap((x) =>
        [-0.95, 0.95].map((z) => (
          <ModelBox
            centre={[x, (deck + cageTop) / 2, z]}
            key={`c${x}:${z}`}
            opacity={props.opacity}
            size={[0.07, cageTop - deck, 0.07]}
            tone="wood"
          />
        )),
      )}
      {[tankX - 0.7, tankX + 0.7].map((x) => (
        <ModelBox
          centre={[x, cageTop, 0]}
          key={`t${x}`}
          opacity={props.opacity}
          size={[0.07, 0.07, 1.97]}
          tone="wood"
        />
      ))}
    </group>
  );
}
