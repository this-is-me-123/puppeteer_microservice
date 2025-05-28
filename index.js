require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/login', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://onlyfans.com', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Click login button to trigger form
    await page.click('a[href="/login"]');
    await page.waitForSelector('input[name="email"]', { timeout: 15000 });

    // Fill credentials
    await page.type('input[name="email"]', process.env.USERNAME, { delay: 50 });
    await page.type('input[name="password"]', process.env.PASSWORD, { delay: 50 });

    await page.click('button[type="submit"]');

    // Wait for either dashboard or error
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 });

    const currentURL = page.url();
    const isLoggedIn = !currentURL.includes('login');

    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotBase64 = screenshot.toString('base64');

    await browser.close();

    res.json({
      status: isLoggedIn ? 'success' : 'failed',
      url: currentURL,
      screenshot: screenshotBase64,
    });
  } catch (err) {
    await browser.close();
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
