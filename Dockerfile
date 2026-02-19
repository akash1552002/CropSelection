# Pull base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose ports
# 8081: Metro Bundler
# 19000, 19001, 19002: Expo ports (legacy, but good to have)
EXPOSE 8081 19000 19001 19002

# Environment variables
ENV NODE_ENV=development

# Start the application
CMD ["npm", "start"]
