# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 5173

# Start the application
CMD ["npm", "start"]
