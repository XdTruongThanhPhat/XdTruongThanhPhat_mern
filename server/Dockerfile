FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose port (default from server.js is 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
