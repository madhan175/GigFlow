# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (using legacy-peer-deps for React 19 / Lucide compatibility)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Production image - NGINX
FROM nginx:alpine

# Copy built assets to NGINX serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port and start NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
