FROM node:20-slim

# Puppeteer needs fonts and dependencies
RUN apt-get update && apt-get install -y \
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
    wget \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# 👇 Make sure Puppeteer's browser gets installed and cached correctly
ENV PUPPETEER_CACHE_DIR=/usr/src/app/.cache/puppeteer
RUN npx puppeteer browsers install chrome

COPY . .

CMD ["npm", "start"]
