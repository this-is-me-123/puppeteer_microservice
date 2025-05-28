FROM node:18-slim

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxss1 \
    libxshmfence1 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libpango-1.0-0 \
    libasound2 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Set app directory
WORKDIR /app
COPY . .

# Install Node dependencies
RUN npm install

CMD ["npm", "start"]
