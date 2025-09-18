FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist

EXPOSE 3003

CMD ["node", "dist/app.js"]