// ./routes/auth.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase-admin-config');

// Acessa JWT_SECRET diretamente da variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET;
const USERS_COLLECTION = 'users';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    const userSnapshot = await db.collection(USERS_COLLECTION).where('username', '==', username).get();
    if (!userSnapshot.empty) {
      return res.status(409).json({ message: 'Este e-mail já está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, role: 'user' };
    const docRef = await db.collection(USERS_COLLECTION).add(newUser);

    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: docRef.id });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar conta.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Tentativa de login para o username:', username);
  console.log('JWT_SECRET em routes/auth:', JWT_SECRET); // Verifique o valor aqui

  try {
    const userSnapshot = await db.collection(USERS_COLLECTION).where('username', '==', username).limit(1).get();
    if (userSnapshot.empty) {
      console.log('Usuário não encontrado para o username:', username);
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;
    console.log('Usuário encontrado:', userData);

    const passwordMatch = await bcrypt.compare(password, userData.password);
    console.log('Resultado da comparação de senha:', passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    if (!JWT_SECRET) {
      console.error('Erro: JWT_SECRET não está definido em routes/auth!');
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

    const token = jwt.sign({ userId, username: userData.username, role: userData.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao autenticar.' });
  }
});

module.exports = router;