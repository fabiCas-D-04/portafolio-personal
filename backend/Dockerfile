# --- Imagen de producción del backend (Express + MongoDB) ---
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production \
    PORT=4000 \
    MONGODB_URI=mongodb://mongo:27017/portfolio

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "src/server.js"]
