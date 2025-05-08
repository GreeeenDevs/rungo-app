// ./server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const middleware = require('./middleware/auth');
require('./config/firebase-admin-config');
require('dotenv').config();

console.log('JWT_SECRET do .env (em server.js):', process.env.JWT_SECRET); // Adicione este log

const app = express();
const PORT = process.env.PORT || 3000;

// Define JWT_SECRET diretamente da variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/public', publicRoutes);
app.use('/admin', middleware.authenticateJWT, adminRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});