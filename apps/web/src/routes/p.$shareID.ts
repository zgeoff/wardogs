import { createFileRoute } from '@tanstack/react-router';
import { findSharedPlanCode } from '@wardogs-love/fob-share';
import { getShareDatabase } from '../share-links/get-share-database';

// a short share link redirects to the planner with the plan's full share code in the fragment, the
// form the planner already opens
export const Route = createFileRoute('/p/$shareID')({
  server: {
    handlers: {
      GET: async (context) => {
        const database = await getShareDatabase();
        const code = await findSharedPlanCode(database, context.params.shareID);

        if (code === undefined) {
          return new Response('This share link does not exist.', {
            status: 404,
            headers: { 'content-type': 'text/plain; charset=utf-8' },
          });
        }

        return new Response(null, {
          status: 302,
          headers: { 'cache-control': 'public, max-age=86400', location: `/fob#plan=${code}` },
        });
      },
    },
  },
});
