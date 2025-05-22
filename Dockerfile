FROM node:20-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends

# Download and install the expected version of Google Chrome (ver. 136.0.7103.94)
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install && \
    rm google-chrome-stable_current_amd64.deb

# Set Puppeteer cache path (optional, depending on config)
ENV PUPPETEER_CACHE_DIR=/usr/src/app/.cache/puppeteer

# Set environment variable for Puppeteer to find Chrome
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose app port if needed (optional)
# EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
