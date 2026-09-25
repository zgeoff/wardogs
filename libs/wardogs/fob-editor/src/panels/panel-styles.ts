import { css } from '@wardogs-love/styled-system/css';

// shared by the side panels, so every panel section lines up
export const panelSection = css({
  borderBottomColor: 'border.subtle',
  borderBottomWidth: '[1px]',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  padding: '3',
});

export const numeric = css({ fontFamily: 'mono', fontVariantNumeric: 'tabular-nums' });
export const mutedText = css({ color: 'text.muted', fontSize: 'xs' });
