import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const WALL = 1.2;
const LOWER = 3;
const DECK = 0.15;
const PARAPET = 0.7;
const ROOF = 5.6;
const CAP = 3;

// a two-storey recon tower: a hesco ground floor, a sandbagged lookout deck under a netted roof,
// and a layer of hesco on the roof
export function ReconTowerModel(props: PieceModelProps) {
  const size = props.size;
  const edge = size.width / 2 - WALL / 2;
  const post = size.width / 2 - 0.1;
  const lookout = LOWER + DECK;
  const capHeight = size.height - ROOF - DECK - 0.1;

  return (
    <group>
      {[-1, 1].flatMap((side) => [
        <ModelBox
          centre={[side * edge, LOWER / 2, 0]}
          key={`x${side}`}
          opacity={props.opacity}
          size={[WALL, LOWER, size.depth]}
          tone="hesco"
        />,
        <ModelBox
          centre={[0, LOWER / 2, side * edge]}
          key={`z${side}`}
          opacity={props.opacity}
          size={[size.width - 2 * WALL, LOWER, WALL]}
          tone="hesco"
        />,
        <ModelBox
          centre={[side * (size.width / 2 - 0.2), lookout + PARAPET / 2, 0]}
          key={`px${side}`}
          opacity={props.opacity}
          size={[0.4, PARAPET, size.depth]}
          tone="sandbag"
        />,
        <ModelBox
          centre={[0, lookout + PARAPET / 2, side * (size.depth / 2 - 0.2)]}
          key={`pz${side}`}
          opacity={props.opacity}
          size={[size.width - 0.8, PARAPET, 0.4]}
          tone="sandbag"
        />,
      ])}
      <ModelBox
        centre={[0, LOWER + DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="wood"
      />
      {[-post, post].flatMap((x) =>
        [-post, post].map((z) => (
          <ModelBox
            centre={[x, (lookout + ROOF) / 2, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[0.16, ROOF - lookout, 0.16]}
            tone="woodDark"
          />
        )),
      )}
      <ModelBox
        centre={[0, ROOF + DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="netting"
      />
      <ModelBox
        centre={[0, ROOF + DECK + capHeight / 2, 0]}
        opacity={props.opacity}
        size={[CAP - 0.06, capHeight, CAP - 0.06]}
        tone="hesco"
      />
      <ModelBox
        centre={[0, ROOF + DECK + capHeight / 2, 0]}
        opacity={props.opacity}
        size={[0.05, capHeight + 0.01, CAP]}
        tone="hescoFrame"
      />
      <ModelBox
        centre={[0, ROOF + DECK + capHeight / 2, 0]}
        opacity={props.opacity}
        size={[CAP, capHeight + 0.01, 0.05]}
        tone="hescoFrame"
      />
    </group>
  );
}
