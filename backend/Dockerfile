FROM node:18-alpine

# Install system dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy database files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY src ./src/

# Compile TypeScript
RUN npm run build

# Expose backend port
EXPOSE 3001

# Boot script: push schema to DB, seed dictionary, and run compiled application
CMD ["sh", "-c", "npx prisma db push && npm run prisma:seed && npm run start:prod"]
