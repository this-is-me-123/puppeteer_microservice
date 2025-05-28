
const { launchBrowser } = require('../utils/browser');
const fs = require('fs');
const path = require('path');

module.exports = async function runLoginFlow() {
  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    attempt++;
    const browser = await launchBrowser();
    const page = await browser.newPage();

    try {
      console.log(`[INFO] Attempt ${attempt}: Navigating to OnlyFans login page...`);
      await page.goto('https://onlyfans.com', { waitUntil: 'domcontentloaded' });

      if (process.env.MOCK_LOGIN === 'true') {
        const mockPath = path.resolve(__dirname, '../mock_login.png');
        await page.screenshot({ path: mockPath });
        console.log(`[INFO] Mock login screenshot saved to ${mockPath}`);
        await browser.close();
        return 'Mock login screenshot saved';
      }

      await page.waitForTimeout(2000);

      await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    const loginInputExists = await page.$('input[name="email"]');
      if (!loginInputExists) {
        throw new Error('Login form not found');
      }

      console.log('[INFO] Login form detected.');
      await browser.close();
      return 'Login flow completed';

    } catch (err) {
      console.warn(`[WARN] Attempt ${attempt} failed: ${err.message}`);
      const errorShot = path.resolve(__dirname, `../error_attempt_${attempt}.png`);
      await page.screenshot({ path: errorShot });
      console.log(`[INFO] Screenshot of error saved: ${errorShot}`);

      await browser.close();
      if (attempt === maxAttempts) {
        throw new Error('Login flow failed after 3 attempts: ' + err.message);
      }
    }
  }
};
