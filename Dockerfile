# --- Stage 1: Build stage with Chrome and Node ---
FROM node:20-slim AS builder

# Install dependencies for Chrome
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
    libxshmfence1 \
    libgbm1 \
    libu2f-udev \
    --no-install-recommends \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Download and install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install && \
    rm google-chrome-stable_current_amd64.deb

# Set working directory
WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# --- Stage 2: Final smaller image ---
FROM node:20-slim

# Install only necessary libs for Chrome runtime (same as above, but minimal)
RUN apt-get update && apt-get install -y \
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
    libxshmfence1 \
    libgbm1 \
    libu2f-udev \
    --no-install-recommends \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Chrome installation from builder stage
COPY --from=builder /usr/bin/google-chrome /usr/bin/google-chrome
COPY --from=builder /opt/google/chrome /opt/google/chrome
COPY --from=builder /usr/lib /usr/lib

# Copy app and node_modules from builder
COPY --from=builder /usr/src/app /usr/src/app

WORKDIR /usr/src/app

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"

CMD ["npm", "start"]
