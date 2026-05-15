# =============================================================================
# Mining Game — Backend Dockerfile (placeholder for future API)
# =============================================================================

FROM node:22-alpine AS production

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

USER app

EXPOSE 4012

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4012/api/health || exit 1

CMD ["node", "src/index.js"]
