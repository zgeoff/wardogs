import { Button, Heading } from '@wardogs-love/design-system';
import { buildStageTotals } from '@wardogs-love/fob';
import { css, cx } from '@wardogs-love/styled-system/css';
import { useEditorStore } from '../state/editor-store';
import { formatSupplies } from './format-supplies';
import { mutedText, numeric, panelSection } from './panel-styles';

const row = css({
  alignItems: 'center',
  borderColor: 'transparent',
  borderRadius: 'sm',
  borderWidth: '[1px]',
  cursor: 'pointer',
  display: 'grid',
  fontSize: 'sm',
  gap: '2',
  gridTemplateColumns: '[1fr auto auto]',
  paddingBlock: '1.5',
  paddingInline: '2',
  textAlign: 'left',
  width: 'full',
  _hover: { backgroundColor: 'bg.hover' },
});

const activeRow = css({
  backgroundColor: 'bg.accentMuted',
  borderColor: 'border.accent',
  _hover: { backgroundColor: 'bg.accentMuted' },
});

const actions = css({ display: 'flex', gap: '2' });
const header = css({ alignItems: 'baseline', display: 'flex', justifyContent: 'space-between' });

export function StagesPanel() {
  const plan = useEditorStore((state) => state.plan);
  const viewStage = useEditorStore((state) => state.viewStage);
  const totals = buildStageTotals(plan);

  return (
    <section aria-label="Stages" className={panelSection}>
      <div className={header}>
        <Heading level={3}>Stages</Heading>
        <span className={mutedText}>supplies · running total</span>
      </div>
      {totals.map((total) => (
        <button
          aria-pressed={total.stage === viewStage}
          className={cx(row, total.stage === viewStage && activeRow)}
          key={total.stage}
          onClick={() => {
            useEditorStore.getState().setViewStage(total.stage);
          }}
          type="button"
        >
          <span>
            Stage {total.stage}
            <span className={mutedText}> · {total.pieceCount} pieces</span>
          </span>
          <span className={numeric}>+{formatSupplies(total.supplies)}</span>
          <span className={cx(numeric, mutedText)}>{formatSupplies(total.cumulativeSupplies)}</span>
        </button>
      ))}
      <div className={actions}>
        <Button
          onClick={() => {
            useEditorStore.getState().addStage();
          }}
          size="sm"
        >
          Add stage
        </Button>
        <Button
          disabled={plan.stageCount === 1}
          onClick={() => {
            useEditorStore.getState().removeStage(viewStage);
          }}
          size="sm"
          variant="danger"
        >
          Remove stage {viewStage}
        </Button>
      </div>
    </section>
  );
}
