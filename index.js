const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

// Add plugins
puppeteerExtra.use(StealthPlugin());
puppeteerExtra.use(AdblockerPlugin({ blockTrackers: true }));

(async () => {
  try {
    const browser = await puppeteerExtra.launch({
      headless: 'new', // or true
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const version = await browser.version();
    console.log(`✅ Chromium is working with puppeteer-extra: ${version}`);

    // Your automation code here, e.g.:
    // const page = await browser.newPage();
    // await page.goto('https://example.com');

    await browser.close();
  } catch (err) {
    console.error('❌ Chromium launch failed:', err);
    process.exit(1);
  }
})();
