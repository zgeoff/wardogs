import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const WALL = 1.2;
const WALL_HEIGHT = 2.4;
const DECK = 0.15;
const DOOR = 1.2;

// a hesco-walled bunker with a doorway front and back, a plank deck, and a camouflage net drawn
// over the top and down its sides
export function BunkerModel(props: PieceModelProps) {
  const size = props.size;
  const segment = (size.width - DOOR) / 2;
  const segmentX = DOOR / 2 + segment / 2;
  const endZ = size.depth / 2 - WALL / 2;
  const sideX = size.width / 2 - WALL / 2;
  const netTop = size.height - 0.05;
  const skirtHeight = netTop - WALL_HEIGHT;

  return (
    <group>
      {[-segmentX, segmentX].flatMap((x) =>
        [-endZ, endZ].map((z) => (
          <ModelBox
            centre={[x, WALL_HEIGHT / 2, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[segment, WALL_HEIGHT, WALL]}
            tone="hescoDark"
          />
        )),
      )}
      {[-sideX, sideX].map((x) => (
        <ModelBox
          centre={[x, WALL_HEIGHT / 2, 0]}
          key={x}
          opacity={props.opacity}
          size={[WALL, WALL_HEIGHT, size.depth - 2 * WALL]}
          tone="hescoDark"
        />
      ))}
      <ModelBox
        centre={[0, WALL_HEIGHT + DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="woodDark"
      />
      <ModelBox
        centre={[0, netTop, 0]}
        opacity={props.opacity}
        size={[size.width, 0.1, size.depth]}
        tone="nettingDark"
      />
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[0, WALL_HEIGHT + skirtHeight / 2, (side * size.depth) / 2]}
          key={`z${side}`}
          opacity={props.opacity}
          size={[size.width, skirtHeight, 0.05]}
          tone="nettingDark"
        />
      ))}
      {[-1, 1].map((side) => (
        <ModelBox
          centre={[(side * size.width) / 2, WALL_HEIGHT + skirtHeight / 2, 0]}
          key={`x${side}`}
          opacity={props.opacity}
          size={[0.05, skirtHeight, size.depth]}
          tone="nettingDark"
        />
      ))}
    </group>
  );
}
