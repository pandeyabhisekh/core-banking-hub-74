const express = require('express');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', authRequired, (req, res) => {
  const data = [
    { id: 'APR-4012', request: 'Account Opening', by: 'Neha Singh', branch: 'South Extension', sla: '14 mins', status: 'Waiting' },
    { id: 'APR-4013', request: 'High Value Transfer', by: 'Dev Sharma', branch: 'South Extension', sla: '5 mins', status: 'Escalated' },
    { id: 'APR-4014', request: 'Credit Limit Enhancement', by: 'Kunal Rao', branch: 'Connaught Place', sla: '26 mins', status: 'Waiting' },
  ];
  res.json({ data });
});

router.get('/pending', authRequired, (req, res) => {
  res.json({ data: [] });
});

router.get('/:id', authRequired, (req, res) => {
  res.json({ data: { id: req.params.id, status: 'Waiting' } });
});

router.post('/:id/approve', authRequired, (req, res) => {
  res.json({ message: 'Approved' });
});

router.post('/:id/reject', authRequired, (req, res) => {
  res.json({ message: 'Rejected' });
});

router.get('/history', authRequired, (req, res) => {
  res.json({ data: [] });
});

router.get('/my-requests', authRequired, (req, res) => {
  res.json({ data: [] });
});

module.exports = router;

