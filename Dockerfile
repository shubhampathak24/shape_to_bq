# Stage 1: Build the application
FROM node:20.11.1-bookworm-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ gcc build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using npm
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Create the final production image
FROM node:20.11.1-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production --legacy-peer-deps

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY server.cjs .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Set health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Run the application
CMD ["node", "server.cjs"]
