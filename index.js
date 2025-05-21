const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

app.get('/login', async (req, res) => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto('https://onlyfans.com', { waitUntil: 'domcontentloaded' });
    res.send('Login attempt complete');
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
