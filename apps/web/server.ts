import { serve } from 'srvx';
import { staticMiddleware } from 'srvx/static';

// serves the production build under Bun: hashed assets from dist/client with a year-long immutable
// cache, other public files with a short one, and every other request through the Start handler

interface StartServerBuild {
  readonly default: {
    // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- the Start handler's own signature takes a live Request
    readonly fetch: (request: Request) => Promise<Response> | Response;
  };
}

const clientDir = new URL('dist/client', import.meta.url).pathname;
const serverBuildPath = new URL('dist/server/server.js', import.meta.url).pathname;

const serverBuild: unknown = await import(serverBuildPath);

if (!isStartServerBuild(serverBuild)) {
  throw new Error(`${serverBuildPath} does not export a fetch handler`);
}

const hashedAssets = staticMiddleware({ dir: clientDir, immutable: true, maxAge: 31_536_000 });
const publicFiles = staticMiddleware({ dir: clientDir, maxAge: 3600 });

serve({
  fetch: (request) => serverBuild.default.fetch(request),
  middleware: [
    (request, next) =>
      new URL(request.url).pathname.startsWith('/assets/')
        ? hashedAssets(request, next)
        : publicFiles(request, next),
  ],
  port: process.env['PORT'] ?? 3000,
});

function isStartServerBuild(value: unknown): value is StartServerBuild {
  return (
    typeof value === 'object' &&
    value !== null &&
    'default' in value &&
    typeof value.default === 'object' &&
    value.default !== null &&
    'fetch' in value.default &&
    typeof value.default.fetch === 'function'
  );
}
