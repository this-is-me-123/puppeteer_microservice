const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const version = await browser.version();
    console.log(`✅ Chromium is working: ${version}`);
    await browser.close();
  } catch (err) {
    console.error('❌ Chromium launch failed:', err);
    process.exit(1);
  }
})();
