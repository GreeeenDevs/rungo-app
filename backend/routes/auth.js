// pet-happiness-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase-admin-config'); // Importa 'db' do Firestore

const USERS_COLLECTION = 'users';
const PETS_COLLECTION = 'pets';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expira em 1 dia
    });
};

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, insira username e password.' });
    }

    try {
        const userRef = db.collection(USERS_COLLECTION).doc(username);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return res.status(400).json({ message: 'Usuário já existe.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userRef.set({
            username: username,
            password: hashedPassword,
            role: 'user', // Define um papel padrão
            createdAt: new Date(),
        });

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            userId: username,
        });
    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({ message: 'Erro no servidor ao registrar usuário.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await db.collection(USERS_COLLECTION).doc(username).get();

        if (!userDoc.exists) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const user = userDoc.data();
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        res.json({
            message: 'Login bem-sucedido!',
            token: generateToken(username), // Gere o token com o userId (username neste caso)
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor ao fazer login.' });
    }
});

module.exports = router;