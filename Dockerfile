# Build stage
FROM node:22-alpine as builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Add non-root user for security
USER node

# Expose port
EXPOSE 8843

CMD ["node", "dist/index.js"]
