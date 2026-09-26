# Builds the web app from the repo root: docker build -f apps/web/Dockerfile .
ARG BUN_VERSION=1.4.2

FROM oven/bun:${BUN_VERSION}-slim AS base

WORKDIR /app

# --- every workspace manifest plus the lockfile, so installs stay frozen to the committed lock ---
FROM base AS manifests

COPY . /source

RUN cd /source && \
  find . -name package.json -not -path '*/node_modules/*' -exec cp --parents {} /app/ \; && \
  cp bun.lock bunfig.toml /app/

# --- full install and build: turbo runs the Panda codegen, the route typegen, then vite ---
FROM base AS builder

COPY --from=manifests /app/ .

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN ./node_modules/.bin/turbo run build --filter=@wardogs-love/web

# --- production dependencies only, hoisted so the server bundle resolves every runtime import from
# one flat node_modules ---
FROM base AS prod-deps

COPY --from=manifests /app/ .

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile --production --linker=hoisted --ignore-scripts \
  --filter=@wardogs-love/web

# --- runtime: Bun serves the Start build through srvx ---
FROM oven/bun:${BUN_VERSION}-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/web/server.ts ./apps/web/server.ts

EXPOSE 3000

WORKDIR /app/apps/web

# Fly mounts the volume at /data owned by root: hand it to the bun user, then drop to that user to
# serve
CMD ["sh", "-c", "if [ -d /data ]; then chown bun:bun /data; fi && exec setpriv --reuid=bun --regid=bun --init-groups bun server.ts"]
