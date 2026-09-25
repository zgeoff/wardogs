import { Kbd } from '@wardogs-love/design-system';
import { css, cx } from '@wardogs-love/styled-system/css';
import { useEditorStore } from '../state/editor-store';
import { numeric } from './panel-styles';

const bar = css({
  backgroundColor: '[rgba(16, 17, 13, 0.85)]',
  borderColor: 'border',
  borderRadius: 'sm',
  borderWidth: '[1px]',
  bottom: '3',
  color: 'text.muted',
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: 'xs',
  gap: '3',
  left: '3',
  paddingBlock: '1.5',
  paddingInline: '2.5',
  pointerEvents: 'none',
  position: 'absolute',
  right: '3',
});

const hint = css({ alignItems: 'center', display: 'inline-flex', gap: '1' });

// the pointer's position in metres, plus the keys that work in the current tool
export function StatusBar() {
  const pointer = useEditorStore((state) => state.pointer);
  const tool = useEditorStore((state) => state.tool);
  const ghostLift = useEditorStore((state) => state.ghostLift);

  return (
    <div className={bar}>
      <span className={cx(numeric)} data-testid="pointer-position">
        {pointer === null ? '—' : `x ${pointer.x.toFixed(2)} m · z ${pointer.z.toFixed(2)} m`}
      </span>
      {tool === 'place' ? (
        <>
          <span className={hint}>
            <Kbd>click</Kbd> place
          </span>
          <span className={hint}>
            <Kbd>R</Kbd> rotate
          </span>
          <span className={hint}>
            <Kbd>PgUp</Kbd>/<Kbd>PgDn</Kbd> lift {ghostLift > 0 ? `(+${ghostLift} m)` : ''}
          </span>
          <span className={hint}>
            <Kbd>Esc</Kbd> stop placing
          </span>
        </>
      ) : (
        <>
          <span className={hint}>
            <Kbd>click</Kbd>/<Kbd>drag</Kbd> select, move
          </span>
          <span className={hint}>
            <Kbd>←↑→↓</Kbd> nudge 0.75 m
          </span>
          <span className={hint}>
            <Kbd>R</Kbd> rotate
          </span>
          <span className={hint}>
            <Kbd>Del</Kbd> delete
          </span>
        </>
      )}
      <span className={hint}>
        <Kbd>right drag</Kbd> pan
      </span>
      <span className={hint}>
        <Kbd>wheel</Kbd> zoom
      </span>
      <span className={hint}>
        <Kbd>F</Kbd> frame the base
      </span>
    </div>
  );
}
