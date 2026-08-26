FROM node:22-slim

WORKDIR /app

RUN corepack enable \
    && chown node:node /app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
