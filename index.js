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
