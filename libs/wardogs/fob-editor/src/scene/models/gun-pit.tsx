import { TorusGeometry } from 'three';
import { ModelCylinder } from './model-cylinder';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const DECK = 0.25;
const BAG = 0.28;

// one course of the pit's sandbag ring, for the catalog's 4.5 m pits
const course = new TorusGeometry(1.85, BAG, 6, 28).rotateX(Math.PI / 2);

// an octagonal timber deck ringed by two courses of sandbags, which a mortar or launcher stands in
export function GunPit(props: PieceModelProps) {
  return (
    <group>
      <ModelCylinder
        centre={[0, DECK / 2, 0]}
        length={DECK}
        opacity={props.opacity}
        radius={props.size.width / 2}
        rotation={[0, Math.PI / 8, 0]}
        sides={8}
        tone="wood"
      />
      <ModelShape
        centre={[0, DECK + BAG, 0]}
        geometry={course}
        opacity={props.opacity}
        tone="sandbag"
      />
      <ModelShape
        centre={[0, DECK + 3 * BAG, 0]}
        geometry={course}
        opacity={props.opacity}
        rotation={[0, Math.PI / 28, 0]}
        tone="sandbagDark"
      />
    </group>
  );
}
