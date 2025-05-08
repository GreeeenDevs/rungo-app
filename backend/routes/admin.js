// ./routes/admin.js
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');

router.get('/data', middleware.authorizeRole('admin'), (req, res) => {
  const adminData = { message: 'Esta é uma informação secreta para administradores!', user: req.user };
  res.json(adminData);
});

module.exports = router;