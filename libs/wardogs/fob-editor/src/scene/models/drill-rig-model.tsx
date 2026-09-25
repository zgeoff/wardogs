import { buildTrussGeometry } from './build-truss-geometry';
import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import { ModelTruss } from './model-truss';
import type { PieceModelProps } from './types';

const BASE = 0.4;
const TOWER = 15.6;
const TOWER_WIDTH = 1.1;
const truss = buildTrussGeometry({ width: TOWER_WIDTH, height: TOWER, bays: 12 });

// the drill rig: a concrete pad with hesco at its corners and its generator plant, a lattice tower,
// and a mast of dishes and antennas above it
export function DrillRigModel(props: PieceModelProps) {
  const size = props.size;
  const mastBase = BASE + TOWER;
  const mastLength = size.height - mastBase;
  const cornerX = size.width / 2 - 0.75;
  const cornerZ = size.depth / 2 - 0.75;
  const legOffset = TOWER_WIDTH / 2;

  return (
    <group>
      <ModelBox
        centre={[0, BASE / 2, 0]}
        opacity={props.opacity}
        size={[size.width, BASE, size.depth]}
        tone="concrete"
      />
      {[-cornerX, cornerX].flatMap((x) =>
        [-cornerZ, cornerZ].map((z) => (
          <ModelBox
            centre={[x, BASE + 0.75, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[1.44, 1.5, 1.44]}
            tone="hesco"
          />
        )),
      )}
      <ModelBox
        centre={[0, BASE + 0.5, -1.9]}
        opacity={props.opacity}
        size={[1.4, 1, 1]}
        tone="drab"
      />
      <ModelBox
        centre={[0, BASE + 0.4, 1.9]}
        opacity={props.opacity}
        size={[1.2, 0.8, 0.9]}
        tone="tank"
      />
      <ModelTruss base={[0, BASE, 0]} geometry={truss} opacity={props.opacity} tone="steel" />
      {[-legOffset, legOffset].flatMap((x) =>
        [-legOffset, legOffset].map((z) => (
          <ModelBox
            centre={[x, BASE + TOWER / 2, z]}
            key={`leg${x}:${z}`}
            opacity={props.opacity}
            size={[0.08, TOWER, 0.08]}
            tone="steel"
          />
        )),
      )}
      <ModelCylinder
        centre={[0, mastBase + mastLength / 2, 0]}
        length={mastLength}
        opacity={props.opacity}
        radius={0.1}
        tone="steel"
      />
      {[0, 1, 2].map((index) => {
        const angle = (index * 2 * Math.PI) / 3;

        return (
          <ModelCylinder
            centre={[Math.cos(angle) * 0.45, mastBase - 2 - index * 1.6, Math.sin(angle) * 0.45]}
            key={index}
            length={0.08}
            opacity={props.opacity}
            radius={0.4}
            rotation={[Math.PI / 2, 0, -angle + Math.PI / 2]}
            sides={16}
            tone={index === 1 ? 'brass' : 'steel'}
          />
        );
      })}
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[side * 0.2, size.height - 0.8, 0]}
          key={side}
          opacity={props.opacity}
          size={[0.12, 1.6, 0.25]}
          tone="rubber"
        />
      ))}
    </group>
  );
}
