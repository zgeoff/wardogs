import { Heading } from '@wardogs-love/design-system';
import { pieceCatalog } from '@wardogs-love/game-data';
import type { PieceCategory } from '@wardogs-love/game-data';
import { css, cx } from '@wardogs-love/styled-system/css';
import { categoryColors } from '../scene/category-colors';
import { useEditorStore } from '../state/editor-store';
import { formatModuleSize } from './format-module-size';
import { formatSupplies } from './format-supplies';
import { numeric, panelSection } from './panel-styles';

const CATEGORY_LABELS: Readonly<Record<PieceCategory, string>> = {
  command: 'Command',
  hesco: 'Hesco',
  bunkers: 'Bunkers',
  barriers: 'Barriers',
  recon: 'Recon',
  defences: 'Defences',
  support: 'Support',
};

const CATEGORIES: readonly PieceCategory[] = [
  'command',
  'hesco',
  'bunkers',
  'barriers',
  'recon',
  'defences',
  'support',
];

const list = css({ display: 'flex', flexDirection: 'column', gap: '0.5' });

const item = css({
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: 'sm',
  borderWidth: '[1px]',
  cursor: 'pointer',
  display: 'grid',
  fontSize: 'sm',
  gap: '2',
  gridTemplateColumns: '[0.5rem 1fr auto]',
  paddingBlock: '1.5',
  paddingInline: '2',
  textAlign: 'left',
  width: 'full',
  _hover: { backgroundColor: 'bg.hover' },
});

const activeItem = css({
  backgroundColor: 'bg.accentMuted',
  borderColor: 'border.accent',
  _hover: { backgroundColor: 'bg.accentMuted' },
});

const swatch = css({ borderRadius: 'xs', height: '2', width: '2' });
const detail = css({ color: 'text.muted', fontSize: 'xs' });

export function Palette() {
  const palettePieceID = useEditorStore((state) => state.palettePieceID);

  return (
    <nav aria-label="Pieces">
      {CATEGORIES.map((category) => (
        <section className={panelSection} key={category}>
          <Heading level={3}>{CATEGORY_LABELS[category]}</Heading>
          <div className={list}>
            {pieceCatalog
              .filter((piece) => piece.category === category)
              .map((piece) => (
                <button
                  aria-pressed={palettePieceID === piece.id}
                  className={cx(item, palettePieceID === piece.id && activeItem)}
                  key={piece.id}
                  onClick={() => {
                    useEditorStore.getState().pickPiece(piece.id);
                  }}
                  type="button"
                >
                  <span className={swatch} style={{ backgroundColor: categoryColors[category] }} />
                  <span>
                    {piece.name}
                    <span className={detail}> {formatModuleSize(piece)}</span>
                  </span>
                  <span className={cx(numeric, detail)}>{formatSupplies(piece.supplies)}</span>
                </button>
              ))}
          </div>
        </section>
      ))}
    </nav>
  );
}
