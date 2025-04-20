# Use official Node.js 18 image
FROM node:18

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
