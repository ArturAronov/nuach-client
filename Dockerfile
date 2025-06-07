# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm i -g pnpm

# Copy package.json first and then conditionally copy pnpm-lock.yaml if it exists
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies (will work with or without lock file)
RUN pnpm i

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm i -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7700
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 7700

CMD ["node", "server.js"]
