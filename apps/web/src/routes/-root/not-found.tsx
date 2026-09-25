import { Link } from '@tanstack/react-router';
import { Heading } from '@wardogs-love/design-system';
import { css } from '@wardogs-love/styled-system/css';

const page = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  justifyContent: 'center',
  minHeight: '[100dvh]',
  padding: '6',
  textAlign: 'center',
});

const link = css({ color: 'text.accent', textDecoration: 'underline' });

export function NotFound() {
  return (
    <main className={page}>
      <Heading level={1}>Off the map</Heading>
      <p>Nothing is built here.</p>
      <Link className={link} to="/">
        Back to the tools
      </Link>
    </main>
  );
}
