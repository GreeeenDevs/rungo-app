// ./routes/public.js
const express = require('express');
const router = express.Router();

router.get('/data', (req, res) => {
  const publicData = { message: 'Esta é uma informação pública!' };
  res.json(publicData);
});

module.exports = router;