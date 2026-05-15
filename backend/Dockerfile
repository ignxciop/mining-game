# =============================================================================
# Mining Game — Backend Dockerfile (placeholder for future API)
# =============================================================================

FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

EXPOSE 4012

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4012/api/health || exit 1

CMD ["node", "src/index.js"]
