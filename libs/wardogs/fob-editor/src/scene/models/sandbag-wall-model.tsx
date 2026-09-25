import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const COURSES = 4;

// one course of the catalog's 3 m sandbag wall, 1 m high in four courses
const course = new RoundedBoxGeometry(2.96, 1 / COURSES, 0.34, 2, 0.08);

// a sandbag wall, its courses laid a little off true
export function SandbagWallModel(props: PieceModelProps) {
  const courseHeight = props.size.height / COURSES;

  return (
    <group>
      {Array.from({ length: COURSES }, (_, index) => (
        <ModelShape
          centre={[index % 2 === 0 ? -0.02 : 0.02, (index + 0.5) * courseHeight, 0]}
          geometry={course}
          key={index}
          opacity={props.opacity}
          tone={index % 2 === 0 ? 'sandbag' : 'sandbagDark'}
        />
      ))}
    </group>
  );
}
