# Stage 1: Build the static React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy configuration files and dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./

# Install dependencies
RUN npm install

# Build arguments for dynamic API endpoint binding during Docker builds
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy source code and build production bundle
COPY src ./src/
RUN npm run build

# Stage 2: Serve the compiled bundle using Nginx
FROM nginx:alpine

# Copy built artifacts from the build container
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite standard server config with SPA route fallback Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start server
CMD ["nginx", "-g", "daemon off;"]
