// ./middleware/auth.js
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase-admin-config');
const JWT_SECRET = process.env.JWT_SECRET; // Acesse a variável de ambiente
const USERS_COLLECTION = 'users'; // Nome da sua coleção de usuários no Firestore

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, async (err, userPayload) => {
      if (err) {
        return res.sendStatus(403); // Token inválido
      }

      try {
        const userDoc = await db.collection(USERS_COLLECTION).doc(userPayload.userId).get();
        if (!userDoc.exists) {
          return res.sendStatus(404); // Usuário não encontrado (token inválido ou expirado)
        }
        req.user = { id: userDoc.id, username:userDoc.username, ...userDoc.data() };
        next();
      } catch (error) {
        console.error('Erro ao buscar usuário do Firestore:', error);
        return res.sendStatus(500);
      }
    });
  } else {
    res.sendStatus(401); // Não autorizado
  }
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.sendStatus(403); // Não tem permissão
    }
  };
};

module.exports = { authenticateJWT, authorizeRole };