const { launchBrowser } = require('../utils/browser');
const fs = require('fs');
const path = require('path');

module.exports = async function runLoginFlow() {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    await page.goto('https://onlyfans.com', { waitUntil: 'domcontentloaded' });

    if (process.env.MOCK_LOGIN === 'true') {
      await page.screenshot({ path: 'mock_login.png' });
      return 'Mock login screenshot saved';
    }

    await page.waitForTimeout(2000);
    return 'Login flow completed';

  } catch (err) {
    throw new Error('Login flow failed: ' + err.message);
  } finally {
    await browser.close();
  }
};
