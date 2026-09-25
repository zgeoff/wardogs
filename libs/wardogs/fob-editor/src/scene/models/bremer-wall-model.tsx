import { ExtrudeGeometry, Shape } from 'three';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const LENGTH = 1.44;

// the Bremer T-wall's profile across its width: a tall slab at -x on a foot that slopes down
// towards +x, for the catalog's 1.5 x 4.5 x 1.5 wall
const profile = new Shape()
  .moveTo(-0.75, 0)
  .lineTo(0.75, 0)
  .lineTo(0.75, 0.35)
  .lineTo(-0.15, 1.3)
  .lineTo(-0.3, 4.5)
  .lineTo(-0.75, 4.5)
  .closePath();

const wall = new ExtrudeGeometry(profile, { depth: LENGTH, bevelEnabled: false }).translate(
  0,
  0,
  -LENGTH / 2,
);

// a precast concrete Bremer T-wall
export function BremerWallModel(props: PieceModelProps) {
  return <ModelShape geometry={wall} opacity={props.opacity} tone="concrete" />;
}
