require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const app = express();
const PORT = process.env.PORT || 8080;

puppeteer.use(StealthPlugin());

app.get('/login', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://onlyfans.com/', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('input[name="email"]', { timeout: 15000 });

    await page.type('input[name="email"]', process.env.OF_EMAIL);
    await page.type('input[name="password"]', process.env.OF_PASSWORD);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);

    const screenshot = await page.screenshot({ encoding: 'base64' });
    const url = page.url();

    res.json({
      success: true,
      url,
      screenshot_base64: screenshot
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
