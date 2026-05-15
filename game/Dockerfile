# =============================================================================
# Mining Game — Dockerfile
# Multi-stage build: install deps → build → serve static with node
# =============================================================================

# ---- Stage 1: Install dependencies ----
FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# ---- Stage 2: Build the application ----
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

# ---- Stage 3: Production static server ----
FROM node:22-alpine AS production

RUN addgroup -S app && adduser -S app -G app

RUN npm install -g serve@14

COPY --from=builder --chown=app:app /app/dist /app/dist

WORKDIR /app

USER app

EXPOSE 4011

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4011/ || exit 1

CMD ["serve", "-s", "dist", "-l", "4011"]
