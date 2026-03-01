FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Expose port
EXPOSE 3003

# Start the application
ENV PORT=3003
ENV HOST=0.0.0.0
CMD ["node", ".output/server/index.mjs"]
