OnlyFans Puppeteer Microservice
This microservice automates login and scraping flows on OnlyFans using Puppeteer with stealth support.

🧰 Tech Stack

Node.js

Express.js

Puppeteer (with Stealth plugin)

Railway (for deployment)

📁 Project Structure

.
├── index.js # Express server entry point
├── .env # Environment variables (excluded from Git)
├── routes/
│ └── login.js # Route for triggering the login flow
├── scripts/
│ └── loginflow.js # Puppeteer login logic
├── sessions/ # Stores session data or cookies
├── utils/
│ └── browser.js # Puppeteer browser launcher
├── package.json
├── .gitignore
└── README.md

⚙️ Environment Variables

Add these in a .env file (not committed to Git):

PORT=3000
SESSION_COOKIE=your_cookie_here
MOCK_LOGIN=false

On Railway, set the same variables in the Environment tab.

🚀 Getting Started

Install dependencies:

npm install

Start the service:

npm run start

📡 API Endpoint

GET /login
Triggers a Puppeteer login flow to OnlyFans.
Optional: Can be extended with query params or auth headers.

🛠 Deployment

We recommend deploying with Railway:

Link this repo

Add environment variables in Railway → Settings → Environment

Use Node 18 and the Nixpacks build system (Railway default)

🔒 Notes

Make sure your .env is excluded in version control (.gitignore)

If using SESSION_COOKIE, keep it secure

🔧 Future Ideas

Add support for scraping other pages (e.g., posts, messages)

Queue login tasks with BullMQ or Redis

Add FastAPI backend to manage task queues (optional integration)

🪪 License

MIT