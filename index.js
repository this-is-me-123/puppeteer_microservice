const puppeteer = require('puppeteer');
(async () => {
try {
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const version = await browser.version();
console.log(✅ Chromium is working: ${version});
await browser.close();
} catch (err) {
console.error('❌ Chromium launch failed:', err);
process.exit(1);
}
})();

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const loginRoute = require('./routes/login');

app.use(express.json());
app.use('/login', loginRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
