# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma/ ./prisma/
RUN npm ci && ./node_modules/.bin/prisma generate

COPY tsconfig.json next.config.js postcss.config.js tailwind.config.js ./
COPY src/ ./src/
COPY public/ ./public/

ENV DOCKER_BUILD=true
RUN npm run build

# Stage 2: Production runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3060
ENV PORT=3060
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
