# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy all source code
COPY . .

# Build React app
RUN npm run build

# Expose port (Railway uses dynamic ports)
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
