import { cva, cx } from '@wardogs-love/styled-system/css';
import type { ComponentPropsWithoutRef } from 'react';

const heading = cva({
  base: {
    color: 'text.heading',
    fontFamily: 'display',
    fontWeight: 'semibold',
    letterSpacing: 'wide',
    lineHeight: 'tight',
    textTransform: 'uppercase',
  },
  variants: {
    level: {
      1: { fontSize: '3xl' },
      2: { fontSize: 'lg' },
      3: { fontSize: 'xs', color: 'text.muted', letterSpacing: 'widest' },
    },
  },
});

type Props = ComponentPropsWithoutRef<'h1'> & { readonly level: 1 | 2 | 3 };

// extra props pass through, so an Ark `asChild` part can set its id and aria attributes here
// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- carries React's DOM attribute types (style, dangerouslySetInnerHTML), which have no readonly form
export function Heading(props: Readonly<Props>) {
  const { level, className, ...headingProps } = props;
  const Tag = `h${level}` as const;

  return <Tag {...headingProps} className={cx(heading({ level }), className)} />;
}
