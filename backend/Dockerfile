# Stage 1: Build stage using node:18-alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
# This is done first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies using npm ci (clean install)
# npm ci is preferred over npm install in Docker for reproducible builds
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Health check (optional but recommended for production)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/test', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "server.js"]
