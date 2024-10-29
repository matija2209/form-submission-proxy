# Build stage
FROM node:22-alpine as builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies exactly as your local env
RUN npm ci

# Copy entire source
COPY . .

# Build using your exact tsconfig
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the built files
COPY --from=builder /usr/src/app/dist ./dist

USER node

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
