import { Button, Heading } from '@wardogs-love/design-system';
import { css } from '@wardogs-love/styled-system/css';
import { useEditorStore } from '../state/editor-store';
import { mutedText, panelSection } from './panel-styles';

const actions = css({ display: 'flex', flexWrap: 'wrap', gap: '2' });
const stageField = css({ alignItems: 'center', display: 'flex', fontSize: 'sm', gap: '2' });

const select = css({
  backgroundColor: 'bg.raised',
  borderColor: 'border',
  borderRadius: 'sm',
  borderWidth: '[1px]',
  paddingBlock: '1',
  paddingInline: '2',
});

export function SelectionPanel() {
  const selection = useEditorStore((state) => state.selection);
  const plan = useEditorStore((state) => state.plan);

  if (selection.size === 0) {
    return null;
  }

  const stages = new Set(
    plan.pieces.filter((piece) => selection.has(piece.id)).map((piece) => piece.stage),
  );

  const sharedStage = stages.size === 1 ? [...stages][0] : undefined;

  return (
    <section aria-label="Selection" className={panelSection}>
      <Heading level={3}>Selection</Heading>
      <span className={mutedText}>
        {selection.size} {selection.size === 1 ? 'piece' : 'pieces'} selected
      </span>
      <label className={stageField}>
        Built in stage
        <select
          className={select}
          onChange={(event) => {
            useEditorStore.getState().setSelectionStage(Number(event.target.value));
          }}
          value={sharedStage ?? ''}
        >
          {sharedStage === undefined && <option value="">mixed</option>}
          {Array.from({ length: plan.stageCount }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>
      <div className={actions}>
        <Button
          onClick={() => {
            useEditorStore.getState().rotateSelection();
          }}
          size="sm"
        >
          Rotate
        </Button>
        <Button
          onClick={() => {
            useEditorStore.getState().removeSelection();
          }}
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </section>
  );
}
