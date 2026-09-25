import { Link } from '@tanstack/react-router';
import { Heading, Wordmark } from '@wardogs-love/design-system';
import { css } from '@wardogs-love/styled-system/css';

const page = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10',
  marginInline: 'auto',
  maxWidth: '4xl',
  minHeight: '[100dvh]',
  paddingBlock: '10',
  paddingInline: '4',
});

const header = css({ alignItems: 'baseline', display: 'flex', justifyContent: 'space-between' });
const intro = css({ color: 'text.muted', maxWidth: 'xl' });

const tools = css({
  display: 'grid',
  gap: '4',
  gridTemplateColumns: '[repeat(auto-fill, minmax(16rem, 1fr))]',
});

const card = css({
  backgroundColor: 'bg.panel',
  borderColor: 'border',
  borderRadius: 'md',
  borderWidth: '[1px]',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  padding: '5',
  transition: 'colors',
  _hover: { borderColor: 'border.accent' },
});

const cardMeta = css({ color: 'text.accent', fontFamily: 'mono', fontSize: 'xs' });

const upcoming = css({
  borderColor: 'border.subtle',
  borderRadius: 'md',
  borderStyle: 'dashed',
  borderWidth: '[1px]',
  color: 'text.faint',
  padding: '5',
});

export function Home() {
  return (
    <main className={page}>
      <header className={header}>
        <Wordmark />
      </header>
      <section>
        <Heading level={1}>Tools for Wardogs</Heading>
        <p className={intro}>
          Plan before you build. Everything runs in your browser and saves on this device.
        </p>
      </section>
      <section className={tools} aria-label="Tools">
        <Link className={card} to="/fob">
          <span className={cardMeta}>0.75 m grid · stages · supply totals</span>
          <Heading level={2}>FOB planner</Heading>
          <p>Lay out a forward operating base on the grid and split it into build stages.</p>
        </Link>
        <div className={upcoming}>More tools later.</div>
      </section>
    </main>
  );
}
