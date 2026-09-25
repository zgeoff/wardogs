import type { RecipeVariantProps } from '@wardogs-love/styled-system/css';
import { cva, cx } from '@wardogs-love/styled-system/css';
import type { ComponentPropsWithoutRef } from 'react';

const button = cva({
  base: {
    alignItems: 'center',
    borderRadius: 'sm',
    borderWidth: '[1px]',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'sans',
    fontWeight: 'semibold',
    gap: '2',
    justifyContent: 'center',
    lineHeight: 'none',
    transition: 'colors',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.4',
    },
    _focusVisible: {
      outlineColor: 'border.accent',
      outlineOffset: '[2px]',
      outlineStyle: 'solid',
      outlineWidth: '[2px]',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
  variants: {
    size: {
      sm: { fontSize: 'xs', height: '7', paddingInline: '2.5' },
      md: { fontSize: 'sm', height: '9', paddingInline: '3.5' },
    },
    square: {
      true: { paddingInline: '0', aspectRatio: 'square' },
    },
    variant: {
      default: {
        backgroundColor: 'bg.raised',
        borderColor: 'border',
        color: 'text.primary',
        _hover: { backgroundColor: 'bg.hover', borderColor: 'border.strong' },
      },
      primary: {
        backgroundColor: 'amber.400',
        borderColor: 'amber.400',
        color: 'text.onAccent',
        _hover: { backgroundColor: 'amber.300', borderColor: 'amber.300' },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: 'text.muted',
        _hover: { backgroundColor: 'bg.hover', color: 'text.primary' },
      },
      danger: {
        backgroundColor: 'transparent',
        borderColor: 'border',
        color: 'text.danger',
        _hover: { backgroundColor: 'bg.hover', borderColor: 'text.danger' },
      },
    },
    active: {
      true: {
        backgroundColor: 'bg.accentMuted',
        borderColor: 'border.accent',
        color: 'text.accent',
        _hover: { backgroundColor: 'bg.accentMuted', borderColor: 'border.accent' },
      },
    },
  },
});

type Props = RecipeVariantProps<typeof button> & ComponentPropsWithoutRef<'button'>;

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- carries React's DOM attribute types (style, dangerouslySetInnerHTML), which have no readonly form
export function Button(props: Readonly<Props>) {
  const [variantProps, buttonProps] = button.splitVariantProps(props);

  return (
    <button
      type="button"
      {...buttonProps}
      className={cx(button(variantProps), buttonProps.className)}
    />
  );
}
