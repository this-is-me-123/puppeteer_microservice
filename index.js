const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Example rotating proxy list
const proxies = [
  'http://proxyuser:proxypass@proxy1.example.com:8000',
  'http://proxyuser:proxypass@proxy2.example.com:8000',
  'http://proxyuser:proxypass@proxy3.example.com:8000'
];

function getRandomProxy() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

app.get('/login', async (req, res) => {
  const proxy = getRandomProxy();

  const browser = await puppeteer.launch({
    headless: true,
    args: [`--no-sandbox`, `--proxy-server=${proxy}`]
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://onlyfans.com', { waitUntil: 'domcontentloaded', timeout: 45000 });

    await page.waitForSelector('input[name="email"]', { timeout: 15000 });
    await page.type('input[name="email"]', process.env.OF_EMAIL);
    await page.type('input[name="password"]', process.env.OF_PASSWORD);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);

    const screenshot = await page.screenshot({ encoding: 'base64' });

    res.json({
      success: true,
      url: page.url(),
      screenshot_base64: screenshot
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
