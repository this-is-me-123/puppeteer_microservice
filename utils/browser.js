
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

puppeteer.use(StealthPlugin());

async function launchBrowser() {
  const proxy = process.env.PROXY;
  const args = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (proxy) {
    args.push(`--proxy-server=${proxy}`);
    console.log('[INFO] Using proxy:', proxy);
  } else {
    console.log('[INFO] No proxy configured.');
  }

  return puppeteer.launch({
    headless: 'new',
    args
  });
}

module.exports = { launchBrowser };
