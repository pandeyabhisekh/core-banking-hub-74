const express = require('express');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/open', authRequired, (req, res) => {
  res.json({ message: 'Counter opened' });
});

router.post('/close', authRequired, (req, res) => {
  res.json({ message: 'Counter closed' });
});

router.get('/cash-position', authRequired, (req, res) => {
  res.json({ data: { vault: 1000000, counter: 250000 } });
});

router.post('/cash-receive', authRequired, (req, res) => {
  res.json({ message: 'Cash received' });
});

router.post('/cash-transfer', authRequired, (req, res) => {
  res.json({ message: 'Cash transferred' });
});

router.get('/vault-balance', authRequired, (req, res) => {
  res.json({ data: { balance: 5000000 } });
});

router.get('/eod-report', authRequired, (req, res) => {
  res.json({ data: [] });
});

router.get('/denomination', authRequired, (req, res) => {
  res.json({ data: [2000, 500, 200, 100, 50, 20, 10] });
});

module.exports = router;

