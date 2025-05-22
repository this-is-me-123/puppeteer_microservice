const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

// Force puppeteer-extra to use full puppeteer
puppeteerExtra.puppeteer = puppeteer;

puppeteerExtra.use(StealthPlugin());
puppeteerExtra.use(AdblockerPlugin({ blockTrackers: true }));

(async () => {
  try {
    const browser = await puppeteerExtra.launch({
      headless: true,
      args: ['--no-sandbox'],
      executablePath: puppeteer.executablePath() // 👈 use Chromium that Puppeteer knows about
    });

    const version = await browser.version();
    console.log(`✅ Chromium is working: ${version}`);
    await browser.close();
  } catch (err) {
    console.error('❌ Chromium launch failed:', err);
    process.exit(1);
  }
})();
