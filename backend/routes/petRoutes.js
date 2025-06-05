const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin-config');

const PETS_COLLECTION = 'pets';
const COLLECTED_PETS_COLLECTION = 'collectedPets';

// Função auxiliar para calcular decadência de atributos
const calculateDecay = (lastActionTime, currentTime, decayRatePerMinute) => {
  const minutesPassed = (currentTime.getTime() - lastActionTime.getTime()) / (1000 * 60);
  return Math.floor(minutesPassed * decayRatePerMinute);
};

// --- Rota para obter o estado atual do bichinho do usuário logado ---
router.get('/', async (req, res) => {
  try {
    const petDocRef = db.collection(PETS_COLLECTION).doc(req.user.id);
    const petDoc = await petDocRef.get();

    if (!petDoc.exists) {
      return res.status(404).json({ message: 'Bichinho não encontrado para este usuário.' });
    }

    let petData = petDoc.data();
    const currentTime = new Date();

    // Converte campos Timestamp do Firestore para Date JS
    petData.lastFed = petData.lastFed.toDate();
    petData.lastSlept = petData.lastSlept.toDate();
    petData.lastPlayed = petData.lastPlayed.toDate();
    petData.lastStepsUpdate = petData.lastStepsUpdate.toDate();

    let changed = false;

    // Atualiza fome com decadência
    const hungerDecay = calculateDecay(petData.lastFed, currentTime, 0.5);
    const oldFome = petData.fome;
    petData.fome = Math.min(100, petData.fome + hungerDecay);
    if (petData.fome !== oldFome) changed = true;
    if (petData.fome >= 100 && petData.happiness > 0) {
      petData.happiness = Math.max(0, petData.happiness - 5);
      changed = true;
    }

    // Atualiza energia com decadência
    const energyDecay = calculateDecay(petData.lastSlept, currentTime, 1);
    const oldEnergia = petData.energia;
    petData.energia = Math.max(0, petData.energia - energyDecay);
    if (petData.energia !== oldEnergia) changed = true;
    if (petData.energia <= 0 && petData.happiness > 0) {
      petData.happiness = Math.max(0, petData.happiness - 5);
      changed = true;
    }

    // Atualiza felicidade com decadência
    const happinessDecay = calculateDecay(petData.lastPlayed, currentTime, 0.2);
    const oldHappiness = petData.happiness;
    petData.happiness = Math.max(0, petData.happiness - happinessDecay);
    if (petData.happiness !== oldHappiness) changed = true;

    // Salva alterações se houve mudanças
    if (changed) {
      await petDocRef.update({
        happiness: petData.happiness,
        fome: petData.fome,
        energia: petData.energia,
      });
      const updatedPetDoc = await petDocRef.get();
      petData = updatedPetDoc.data();
    }

    res.json(petData);
  } catch (err) {
    console.error('Erro ao buscar pet:', err);
    res.status(500).json({ message: err.message });
  }
});

// --- Rota para "chocar" um ovo e criar o bichinho ---
router.post('/hatch', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dinosaurId } = req.body;

    const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
    const petDoc = await petDocRef.get();

    if (petDoc.exists && petDoc.data().stage !== 'Ovo') {
      return res.status(400).json({ message: 'Você já tem um bichinho chocado!' });
    }

    const petData = {
      ownerId: userId,
      name: name || 'Seu Novo RunGO',
      dinosaurId: dinosaurId || 'dino_azul', // padrão
      stage: 'Filhote',
      happiness: 70,
      fome: 0,
      energia: 100,
      lastFed: new Date(),
      lastPlayed: new Date(),
      lastSlept: new Date(),
      lastStepsUpdate: new Date(),
      totalStepsLife: 0,
      dailyStepsGoal: 5000,
      evolutionProgress: 0,
      createdAt: new Date(),
    };

    await petDocRef.set(petData, { merge: true });

    const newPetDoc = await petDocRef.get();
    res.status(200).json(newPetDoc.data());
  } catch (err) {
    console.error('Erro ao chocar pet:', err);
    res.status(500).json({ message: err.message });
  }
});

// --- Rota para atualizar felicidade do bichinho com base nos passos ---
router.post('/updateHappiness', async (req, res) => {
  const { steps } = req.body;

  if (typeof steps !== 'number' || steps < 0) {
    return res.status(400).json({ message: 'Número de passos inválido.' });
  }

  try {
    const userId = req.user.id;
    const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
    const petDoc = await petDocRef.get();

    if (!petDoc.exists) {
      return res.status(404).json({ message: 'Bichinho não encontrado.' });
    }

    let petData = petDoc.data();

    const happinessIncrease = Math.floor(steps / 100);
    petData.happiness = Math.min(100, petData.happiness + happinessIncrease);
    petData.totalStepsLife += steps;

    if (petData.stage === 'Filhote' && petData.totalStepsLife >= 10000 && petData.evolutionProgress < 1) {
      petData.stage = 'Adulto';
      petData.happiness = Math.min(100, petData.happiness + 20);
      petData.evolutionProgress = 1;
      await petDocRef.update(petData);
      const updatedPetDoc = await petDocRef.get();
      return res.json({ message: 'Seu bichinho evoluiu para Adulto!', ...updatedPetDoc.data() });
    } else if (petData.stage === 'Adulto' && petData.totalStepsLife >= 50000 && petData.evolutionProgress < 2) {
      petData.stage = 'Idoso';
      petData.happiness = Math.min(100, petData.happiness + 10);
      petData.evolutionProgress = 2;
      await petDocRef.update(petData);
      const updatedPetDoc = await petDocRef.get();
      return res.json({ message: 'Seu bichinho evoluiu para Idoso!', ...updatedPetDoc.data() });
    }

    petData.lastStepsUpdate = new Date();

    await petDocRef.update({
      happiness: petData.happiness,
      totalStepsLife: petData.totalStepsLife,
      lastStepsUpdate: petData.lastStepsUpdate,
    });

    const updatedPetDoc = await petDocRef.get();
    res.json(updatedPetDoc.data());
  } catch (err) {
    console.error('Erro ao atualizar felicidade do pet:', err);
    res.status(500).json({ message: err.message });
  }
});

// --- Rotas para ações do bichinho: alimentar, brincar e dormir ---
router.post('/feed', async (req, res) => {
  try {
    const userId = req.user.id;
    const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
    const petDoc = await petDocRef.get();

    if (!petDoc.exists) return res.status(404).json({ message: 'Bichinho não encontrado.' });

    let petData = petDoc.data();
    petData.fome = Math.max(0, petData.fome - 30);
    petData.happiness = Math.min(100, petData.happiness + 15);
    petData.energia = Math.min(100, petData.energia + 5);
    petData.lastFed = new Date();

    await petDocRef.update({
      fome: petData.fome,
      happiness: petData.happiness,
      energia: petData.energia,
      lastFed: petData.lastFed,
    });

    const updatedPetDoc = await petDocRef.get();
    res.json(updatedPetDoc.data());
  } catch (err) {
    console.error('Erro ao alimentar pet:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/play', async (req, res) => {
  try {
    const userId = req.user.id;
    const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
    const petDoc = await petDocRef.get();

    if (!petDoc.exists) return res.status(404).json({ message: 'Bichinho não encontrado.' });

    let petData = petDoc.data();

    if (petData.energia < 20) {
      return res.status(400).json({ message: 'Seu bichinho está muito cansado para brincar!' });
    }

    petData.happiness = Math.min(100, petData.happiness + 20);
    petData.fome = Math.min(100, petData.fome + 10);
    petData.energia = Math.max(0, petData.energia - 20);
    petData.lastPlayed = new Date();

    await petDocRef.update({
      happiness: petData.happiness,
      fome: petData.fome,
      energia: petData.energia,
      lastPlayed: petData.lastPlayed,
    });

    const updatedPetDoc = await petDocRef.get();
    res.json(updatedPetDoc.data());
  } catch (err) {
    console.error('Erro ao brincar com pet:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/sleep', async (req, res) => {
  try {
    const userId = req.user.id;
    const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
    const petDoc = await petDocRef.get();

    if (!petDoc.exists) return res.status(404).json({ message: 'Bichinho não encontrado.' });

    let petData = petDoc.data();

    petData.energia = Math.min(100, petData.energia + 50);
    petData.fome = Math.min(100, petData.fome + 10);
    petData.happiness = Math.min(100, petData.happiness + 5);
    petData.lastSlept = new Date();

    await petDocRef.update({
      energia: petData.energia,
      fome: petData.fome,
      happiness: petData.happiness,
      lastSlept: petData.lastSlept,
    });

    const updatedPetDoc = await petDocRef.get();
    res.json(updatedPetDoc.data());
  } catch (err) {
    console.error('Erro ao colocar pet para dormir:', err);
    res.status(500).json({ message: err.message });
  }
});

// --- Rota para arquivar o bichinho (coleção separada) ---
router.post('/archive', async (req, res) => {
  try {
    const userId = req.user.id;
    const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
    const petDoc = await petDocRef.get();

    if (!petDoc.exists) return res.status(404).json({ message: 'Bichinho não encontrado.' });

    const petData = petDoc.data();
    // Adiciona o pet arquivado como um novo documento único (usando timestamp como ID)
    await db.collection(COLLECTED_PETS_COLLECTION)
      .add({
        ...petData,
        archivedAt: new Date(),
        ownerId: userId,
      });
    await petDocRef.delete();

    res.json({ message: 'Bichinho arquivado com sucesso.' });
  } catch (err) {
    console.error('Erro ao arquivar pet:', err);
    res.status(500).json({ message: err.message });
  }
});

// --- Rota para listar pets arquivados ---
router.get('/collection', async (req, res) => {
  try {
    const userId = req.user.username;
    // Busca por todos os pets arquivados do usuário
    const snapshot = await db.collection(COLLECTED_PETS_COLLECTION)
      .where('ownerId', '==', userId)
      .orderBy('archivedAt', 'desc')
      .get();

    if (snapshot.empty) {
      return res.json([]); // retorna array vazio
    }

    const pets = [];
    snapshot.forEach(doc => {
      pets.push({ ...doc.data(), _id: doc.id });
    });

    res.json(pets);
  } catch (err) {
    console.error('Erro ao buscar pets arquivados:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;