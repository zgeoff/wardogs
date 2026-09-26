import { createFileRoute } from '@tanstack/react-router';
import { FOBPlanner } from '@wardogs-love/fob-editor';
import { createShareLink } from '../share-links/create-share-link';

// the planner is a WebGL scene with browser-only storage, so it renders on the client only
export const Route = createFileRoute('/fob')({
  ssr: false,
  head: () => ({ meta: [{ title: 'FOB planner · wardogs ❤️' }] }),
  component: FOBPlannerPage,
});

function FOBPlannerPage() {
  return <FOBPlanner createShareLink={createShortShareURL} />;
}

async function createShortShareURL(code: string): Promise<string> {
  const shareID = await createShareLink({ data: code });

  return `${globalThis.location.origin}/p/${shareID}`;
}
