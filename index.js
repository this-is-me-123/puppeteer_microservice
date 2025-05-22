const puppeteer = require('puppeteer-core'); // or 'puppeteer' if you switched

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    headless: 'new', // Modern headless mode (since Chrome 112+)
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-infobars',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log(await page.title());

  await browser.close();
})();
