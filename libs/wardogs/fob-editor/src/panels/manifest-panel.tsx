import { Heading } from '@wardogs-love/design-system';
import { buildManifest, isOutsideFOBArea } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import { css, cx } from '@wardogs-love/styled-system/css';
import { useEditorStore } from '../state/editor-store';
import { formatSupplies } from './format-supplies';
import { mutedText, numeric, panelSection } from './panel-styles';

const table = css({ borderCollapse: 'collapse', fontSize: 'sm', width: 'full' });
const cell = css({ fontWeight: 'normal', paddingBlock: '0.5', textAlign: 'left' });
const right = css({ textAlign: 'right' });
const warning = css({ color: 'text.warning', fontSize: 'xs' });

export function ManifestPanel() {
  const plan = useEditorStore((state) => state.plan);
  const viewStage = useEditorStore((state) => state.viewStage);
  const lines = buildManifest(plan, viewStage);
  const total = lines.reduce((sum, line) => sum + line.supplies, 0);

  const outsideCount = plan.pieces.filter(
    (piece) => piece.stage <= viewStage && isOutsideFOBArea(plan, piece),
  ).length;

  return (
    <section aria-label="Manifest" className={panelSection}>
      <Heading level={3}>Built by stage {viewStage}</Heading>
      {lines.length === 0 ? (
        <span className={mutedText}>Nothing built yet.</span>
      ) : (
        <table className={table}>
          <tbody>
            {lines.map((line) => (
              <tr key={line.pieceID}>
                <td className={cell}>{getPiece(line.pieceID).name}</td>
                <td className={cx(cell, numeric, right)}>×{line.count}</td>
                <td className={cx(cell, numeric, right)}>{formatSupplies(line.supplies)}</td>
              </tr>
            ))}
            <tr>
              <th className={cell} colSpan={2} scope="row">
                Total supplies
              </th>
              <td className={cx(cell, numeric, right)}>{formatSupplies(total)}</td>
            </tr>
          </tbody>
        </table>
      )}
      {outsideCount > 0 && (
        <output className={warning}>
          {outsideCount} {outsideCount === 1 ? 'piece needs' : 'pieces need'} a FOB square to stand
          in
        </output>
      )}
    </section>
  );
}
