import { css } from '@wardogs-love/styled-system/css';

const wordmark = css({
  color: 'text.heading',
  fontFamily: 'display',
  fontSize: 'lg',
  fontWeight: 'semibold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

export function Wordmark() {
  return (
    <span className={wordmark}>
      wardogs <span aria-label="love">❤️</span>
    </span>
  );
}
