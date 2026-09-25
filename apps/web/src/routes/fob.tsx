import { createFileRoute } from '@tanstack/react-router';

// the planner is a WebGL scene with browser-only storage, so it renders on the client only
export const Route = createFileRoute('/fob')({
  ssr: false,
  head: () => ({ meta: [{ title: 'FOB planner · wardogs ❤️' }] }),
  component: FOBPlannerPage,
});

function FOBPlannerPage() {
  return <main>FOB planner</main>;
}
