import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const POST = 0.14;
const ROOF_HEIGHT = 0.15;

// a timber door frame under a plank roof, its door shut across the piece's width
export function DoorModel(props: PieceModelProps) {
  const size = props.size;
  const postHeight = size.height - ROOF_HEIGHT;
  const postX = size.width / 2 - POST / 2;
  const postZ = size.depth / 2 - POST / 2;

  const corners = [
    [-postX, -postZ],
    [-postX, postZ],
    [postX, -postZ],
    [postX, postZ],
  ] as const;

  return (
    <group>
      {corners.map(([x, z]) => (
        <ModelBox
          centre={[x, postHeight / 2, z]}
          key={`${x}:${z}`}
          opacity={props.opacity}
          size={[POST, postHeight, POST]}
          tone="woodDark"
        />
      ))}
      <ModelBox
        centre={[0, size.height - ROOF_HEIGHT / 2, 0]}
        opacity={props.opacity}
        size={[size.width, ROOF_HEIGHT, size.depth]}
        tone="wood"
      />
      <ModelBox
        centre={[0, (postHeight - 0.1) / 2, 0]}
        opacity={props.opacity}
        size={[0.08, postHeight - 0.1, size.depth - 2 * POST]}
        tone="wood"
      />
    </group>
  );
}
