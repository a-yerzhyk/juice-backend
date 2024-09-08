# Use an official Node.js runtime as a parent image
FROM node:21.6.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the Fastify server listens on
EXPOSE 8000

# Define environment variables if needed (you can also set these in docker-compose.yml)
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "app.js"]
