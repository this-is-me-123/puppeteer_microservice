const express = require('express');
const router = express.Router();
const runLoginFlow = require('../scripts/loginflow');

router.get('/', async (req, res) => {
  try {
    const result = await runLoginFlow();
    res.json({ status: 'success', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
