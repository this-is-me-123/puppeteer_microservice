# Use Node.js 20 as base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Set Puppeteer cache directory explicitly so it persists during build
ENV PUPPETEER_CACHE_DIR=/usr/src/app/.cache/puppeteer

# Install Puppeteer's required version of Chrome
RUN npx puppeteer browsers install chrome

# Copy the rest of the source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
