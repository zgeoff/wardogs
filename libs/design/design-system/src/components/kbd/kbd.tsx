import { css } from '@wardogs-love/styled-system/css';
import type { ReactNode } from 'react';

const kbd = css({
  backgroundColor: 'bg.raised',
  borderColor: 'border.strong',
  borderRadius: 'xs',
  borderWidth: '[1px]',
  color: 'text.primary',
  fontFamily: 'mono',
  fontSize: 'xs',
  paddingInline: '1',
  paddingBlock: '0.5',
});

interface Props {
  readonly children: ReactNode;
}

export function Kbd(props: Props) {
  return <kbd className={kbd}>{props.children}</kbd>;
}
