FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Install Puppeteer's required version of Chrome
RUN npx puppeteer browsers install chrome

# Copy app source code
COPY . .

# Run the service
CMD ["npm", "start"]
