import { Line } from '@react-three/drei';
import { FOB_AREA_HALF_EXTENT, buildPieceBox } from '@wardogs-love/fob';
import { useEditorStore } from '../state/editor-store';
import { sceneColors } from './category-colors';

// the 120 m square each visible FOB claims, drawn just above the ground
export function FOBAreas() {
  const plan = useEditorStore((state) => state.plan);
  const viewStage = useEditorStore((state) => state.viewStage);
  const fobs = plan.pieces.filter((piece) => piece.pieceID === 'fob' && piece.stage <= viewStage);

  return (
    <group name="fob-areas">
      {fobs.map((fob) => {
        const box = buildPieceBox(fob);
        const centreX = (box.min.x + box.max.x) / 2;
        const centreZ = (box.min.z + box.max.z) / 2;
        const reach = FOB_AREA_HALF_EXTENT;

        return (
          <Line
            color={sceneColors.fobArea}
            dashed
            dashSize={2}
            gapSize={1}
            key={fob.id}
            lineWidth={1.5}
            points={[
              [centreX - reach, 0.02, centreZ - reach],
              [centreX + reach, 0.02, centreZ - reach],
              [centreX + reach, 0.02, centreZ + reach],
              [centreX - reach, 0.02, centreZ + reach],
              [centreX - reach, 0.02, centreZ - reach],
            ]}
          />
        );
      })}
    </group>
  );
}
