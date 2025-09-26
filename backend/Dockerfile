FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package.json and lock file
COPY package*.json ./

RUN npm install

# Copy rest of the source
COPY ./ ./

RUN npm run build

# ---- Run stage ----
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "start"]
