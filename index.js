const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/login', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    const version = await browser.version();
    console.log('✅ Chromium is working: ${version}');
    await browser.close();
    res.send(`Page title: ${title}`);
  } catch (err) {
    console.error('❌ Chromium launch failed:', err);
    res.status(500).send({ error: err.message });
    process.exit(1);
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));