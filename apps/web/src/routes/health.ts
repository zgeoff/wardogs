import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: () => Response.json({ ok: true, sha: process.env['GIT_SHA'] ?? 'dev' }),
    },
  },
});
