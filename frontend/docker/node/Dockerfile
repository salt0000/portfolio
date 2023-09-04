FROM node:18.17.1-alpine AS base
WORKDIR /app
ENV HOSTNAME "0.0.0.0"


FROM base AS deps
COPY ./client/package*.json ./
RUN npm ci --production


FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY ./client ./
RUN npm run build
RUN cp -r .next/static .next/standalone/.next/static && \
    cp -r public .next/standalone/public


FROM base AS local
COPY --from=builder /app/.next/standalone ./
COPY ./client/.env.local ./
CMD ["node", "server.js"]


FROM base AS deployment
COPY --from=builder /app/.next/standalone ./
COPY ./client/.env ./
CMD ["node", "server.js"]