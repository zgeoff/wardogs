import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const PLANK = 0.5;

// a floor of timber planks laid across the piece's width
export function PlankFloorModel(props: PieceModelProps) {
  const size = props.size;
  const count = Math.round(size.depth / PLANK);
  const pitch = size.depth / count;

  return (
    <group>
      {Array.from({ length: count }, (_, index) => (
        <ModelBox
          centre={[0, size.height / 2, (index + 0.5) * pitch - size.depth / 2]}
          key={index}
          opacity={props.opacity}
          size={[size.width, size.height, pitch - 0.03]}
          tone={index % 2 === 0 ? 'wood' : 'woodDark'}
        />
      ))}
    </group>
  );
}
