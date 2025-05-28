require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

puppeteer.use(StealthPlugin());
const app = express();
const PORT = process.env.PORT || 8080;

const getProxyUrl = () => {
  return `http://${process.env.PROXY_USER}:${process.env.PROXY_PASS}@${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`;
};

// Route for proxy test using Axios
app.get('/proxy-check', async (req, res) => {
  const url = 'https://ip.decodo.com/json';
  const agent = new HttpsProxyAgent(getProxyUrl());

  try {
    const response = await axios.get(url, { httpsAgent: agent });
    res.json({ success: true, proxy_response: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puppeteer-based login
app.get('/login', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=${getProxyUrl()}`
    ]
  });

  const page = await browser.newPage();
  await page.authenticate({
    username: process.env.PROXY_USER,
    password: process.env.PROXY_PASS
  });

  try {
    await page.goto('https://onlyfans.com/login', { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('input[name="email"]', { timeout: 30000 });
    await page.type('input[name="email"]', process.env.OF_EMAIL, { delay: 50 });
    await page.type('input[name="password"]', process.env.OF_PASSWORD, { delay: 50 });

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    const cookies = await page.cookies();
    const finalUrl = page.url();
    const screenshot = await page.screenshot({ encoding: 'base64' });

    res.json({
      success: true,
      url: finalUrl,
      cookies,
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