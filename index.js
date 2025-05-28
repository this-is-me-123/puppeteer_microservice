
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

  const loginUrl = `http://api.scraperapi.com?api_key=${process.env.SCRAPERAPI_KEY}&render=true&url=https://onlyfans.com/?return_to=%2Flogin`;

  try {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const htmlContent = await page.content();

    // Check for unauthorized or invalid API key
    if (htmlContent.includes('Unauthorized request') || htmlContent.includes('API key is invalid')) {
      const screenshot = await page.screenshot({ encoding: 'base64' });
      throw new Error('Unauthorized request. Check your ScraperAPI key.');
    }

    // Check if login form is present
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    const emailInput = await page.$('input[name="email"]');
    if (!emailInput) {
      const screenshot = await page.screenshot({ encoding: 'base64' });
      throw new Error('Login form not found. Page may not have loaded correctly.');
    }

    await page.type('input[name="email"]', process.env.OF_EMAIL);
    await page.type('input[name="password"]', process.env.OF_PASSWORD);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);

    
    const finalUrl = page.url();

    // Extract auth data
    const cookies = await page.cookies();
    const localStorage = await page.evaluate(() => {
      let store = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        store[key] = localStorage.getItem(key);
      }
      return store;
    });

    const sessionStorage = await page.evaluate(() => {
      let store = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        store[key] = sessionStorage.getItem(key);
      }
      return store;
    });

    const fs = require('fs');
    fs.writeFileSync('session.json', JSON.stringify({ cookies, localStorage, sessionStorage }, null, 2));
    console.log('[INFO] session.json saved');
    
    const screenshot = await page.screenshot({ encoding: 'base64' });

    res.json({
      success: true,
      url: finalUrl,
      screenshot_base64: screenshot
    });

  } catch (err) {
    const fallbackScreenshot = await page.screenshot({ encoding: 'base64' });
    const html = await page.content();
    res.status(500).json({
      error: err.message,
      screenshot_base64: fallbackScreenshot,
      html_snippet: html.slice(0, 1000)
    });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
