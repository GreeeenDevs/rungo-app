// pet-happiness-backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const jwt = require('jsonwebtoken'); // Não é necessário aqui, pois auth.js cuida disso
// const bcrypt = require('bcryptjs'); // Não é necessário aqui, auth.js cuida disso

// Importa a instância do Firestore para que possa ser usada globalmente ou passada
const { db } = require('./config/firebase-admin-config');

// Importa os middlewares
const { authenticateJWT, authorizeRole } = require('./middleware/auth');

// Importa as rotas
const authRoutes = require('./routes/auth'); // Agora o login/registro estará aqui
const petRoutes = require('./routes/petRoutes'); // Suas novas rotas de pet

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Rotas ---
app.use('/auth', authRoutes); // Rotas de login e registro

// Todas as rotas abaixo destas precisarão de autenticação JWT
app.use('/api/pet', authenticateJWT, petRoutes); // Rotas protegidas para o bichinho

app.get('/', (req, res) => {
    res.send('Backend do Pet Happiness App (Firestore) está funcionando!');
});

// Tratamento de erros genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});