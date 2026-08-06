# --- deps: install all deps once, reused by build & (optionally) dev ---
FROM node:20-alpine AS deps
WORKDIR /app
# Prisma's engine binaries are dynamically linked against OpenSSL — Alpine
# doesn't ship it by default, so without this Prisma silently falls back
# to a guessed engine variant and crashes at runtime with a cryptic
# "Could not parse schema engine response" error.
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

# --- build: compile TypeScript ---
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- production runtime: only prod deps + compiled output ---
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install --omit=dev
RUN npx prisma generate
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
