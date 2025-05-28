
# OnlyFans Puppeteer Bot

This project automates login and session capture from OnlyFans using Puppeteer.

## 🚀 Deploy on Railway

1. Push this repo to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project > Deploy from GitHub
4. Add `.env` with:

```
OF_EMAIL=your@email.com
OF_PASSWORD=yourpassword
SCRAPERAPI_KEY=your_scraperapi_key
PROXY=http://your.proxy:port
PORT=8080
```

5. Done! Visit `/login` to trigger login and session capture.

Output is saved to `session.json`.
