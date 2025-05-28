require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const app = express();
const PORT = process.env.PORT || 8080;

puppeteer.use(StealthPlugin());

async function retryPageGoto(page, url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await page.goto(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retrying navigation (${i + 1})...`);
    }
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/login', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log("➡️  Launching Puppeteer");

    await retryPageGoto(page, `http://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=https://onlyfans.com/`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForSelector('input[name="email"]', { timeout: 15000 });
    await page.type('input[name="email"]', process.env.OF_EMAIL);
    await page.type('input[name="password"]', process.env.OF_PASSWORD);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);

    const screenshot = await page.screenshot({ encoding: 'base64' });
    const url = page.url();

    console.log("✅ Logged in and captured screenshot");

    res.json({
      success: true,
      url,
      screenshot_base64: screenshot
    });
  } catch (err) {
    console.error("❌ Error during login:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});