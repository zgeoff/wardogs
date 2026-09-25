import { css } from '@wardogs-love/styled-system/css';
import { useRef } from 'react';
import { ManifestPanel } from './panels/manifest-panel';
import { Palette } from './panels/palette';
import { SelectionPanel } from './panels/selection-panel';
import { StagesPanel } from './panels/stages-panel';
import { StatusBar } from './panels/status-bar';
import { TopBar } from './panels/top-bar';
import { usePlanPersistence } from './persistence/use-plan-persistence';
import { PlannerCanvas } from './scene/planner-canvas';
import { useEditorHotkeys } from './use-editor-hotkeys';
import { useLiftWheel } from './use-lift-wheel';

const layout = css({
  display: 'grid',
  gridTemplateAreas: '"top top top" "palette scene side"',
  gridTemplateColumns: '[token(sizes.sidebar) 1fr token(sizes.sidebar)]',
  gridTemplateRows: '[auto 1fr]',
  height: '[100dvh]',
  overflow: 'hidden',
});

const top = css({ gridArea: 'top' });

const sidebar = css({
  backgroundColor: 'bg.panel',
  borderColor: 'border',
  minHeight: '0',
  overflowY: 'auto',
});

const palette = css({ gridArea: 'palette', borderRightWidth: '[1px]' });
const side = css({ gridArea: 'side', borderLeftWidth: '[1px]' });
const scene = css({ gridArea: 'scene', minHeight: '0', minWidth: '0', position: 'relative' });

export function FOBPlanner() {
  const status = usePlanPersistence();
  const sceneRef = useRef<HTMLElement>(null);

  useEditorHotkeys();
  useLiftWheel(sceneRef);

  return (
    <div className={layout}>
      <div className={top}>
        <TopBar status={status} />
      </div>
      <aside className={`${sidebar} ${palette}`}>
        <Palette />
      </aside>
      <main className={scene} ref={sceneRef}>
        {status !== 'loading' && <PlannerCanvas />}
        <StatusBar />
      </main>
      <aside className={`${sidebar} ${side}`}>
        <StagesPanel />
        <SelectionPanel />
        <ManifestPanel />
      </aside>
    </div>
  );
}
