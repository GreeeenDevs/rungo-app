// pet-happiness-backend/routes/petRoutes.js
const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-admin-config'); // Importa 'db' do Firestore
const Pet = require('../models/Pet')
const CollectedPet = require ('../models/CollectedPets')

const PETS_COLLECTION = 'pets';

// Função auxiliar para calcular decadência de atributos
const calculateDecay = (lastActionTime, currentTime, decayRatePerMinute) => {
    const minutesPassed = (currentTime.getTime() - lastActionTime.toDate().getTime()) / (1000 * 60);
    return Math.floor(minutesPassed * decayRatePerMinute);
};

// Rota para obter o estado atual do bichinho do usuário logado
router.get('/', async (req, res) => {
    try {
        // req.user.id é o username do usuário logado (definido pelo middleware 'authenticateJWT')
        const petDocRef = db.collection(PETS_COLLECTION).doc(req.user.id);
        const petDoc = await petDocRef.get();

        if (!petDoc.exists) {
            // Isso pode acontecer se o pet não foi criado no registro, ou se o usuário não tiver um pet.
            // Retorne 404 para que o frontend saiba que precisa chocar um ovo.
            return res.status(404).json({ message: 'Bichinho não encontrado para este usuário.' });
        }

        let petData = petDoc.data();

        // --- Aplicar lógica de decadência ao obter o pet ---
        const currentTime = new Date();

        // Converter timestamps do Firestore para Date objects para cálculo
        petData.lastFed = petData.lastFed.toDate();
        petData.lastSlept = petData.lastSlept.toDate();
        petData.lastPlayed = petData.lastPlayed.toDate();
        petData.lastStepsUpdate = petData.lastStepsUpdate.toDate(); // Garante que lastStepsUpdate seja um Date

        let changed = false;

        // Fome aumenta com o tempo
        const hungerDecay = calculateDecay(petData.lastFed, currentTime, 0.5); // 0.5 fome/min
        const oldFome = petData.fome;
        petData.fome = Math.min(100, petData.fome + hungerDecay);
        if (petData.fome !== oldFome) changed = true;
        if (petData.fome >= 100 && petData.happiness > 0) { // Penalidade por muita fome
            const oldHappiness = petData.happiness;
            petData.happiness = Math.max(0, petData.happiness - 5);
            if (petData.happiness !== oldHappiness) changed = true;
        }

        // Energia diminui com o tempo
        const energyDecay = calculateDecay(petData.lastSlept, currentTime, 1); // 1 energia/min
        const oldEnergia = petData.energia;
        petData.energia = Math.max(0, petData.energia - energyDecay);
        if (petData.energia !== oldEnergia) changed = true;
        if (petData.energia <= 0 && petData.happiness > 0) { // Penalidade por sem energia
            const oldHappiness = petData.happiness;
            petData.happiness = Math.max(0, petData.happiness - 5);
            if (petData.happiness !== oldHappiness) changed = true;
        }

        // Felicidade diminui se não houver interação (opcional, pode ser baseada em fome/energia)
        const happinessDecay = calculateDecay(petData.lastPlayed, currentTime, 0.2); // 0.2 felicidade/min
        const oldHappiness2 = petData.happiness;
        petData.happiness = Math.max(0, petData.happiness - happinessDecay);
        if (petData.happiness !== oldHappiness2) changed = true;


        // Se houve alguma alteração pela decadência, salve o pet de volta no Firestore
        if (changed) {
            await petDocRef.update({
                happiness: petData.happiness,
                fome: petData.fome,
                energia: petData.energia,
                // Não atualize lastFed/Played/Slept aqui, pois não são ações do usuário, são decadências
            });
             // Recarregar os dados para garantir que os timestamps estejam atualizados no objeto retornado
            const updatedPetDoc = await petDocRef.get();
            petData = updatedPetDoc.data();
        }

        res.json(petData);
    } catch (err) {
        console.error('Erro ao buscar pet:', err);
        res.status(500).json({ message: err.message });
    }
});

// Rota para "chocar" um ovo e criar o bichinho
router.post('/hatch', async (req, res) => {
    try {
        const userId = req.user.id; // O username do usuário logado
        const { name } = req.body;

        const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
        const petDoc = await petDocRef.get();

        if (petDoc.exists && petDoc.data().stage !== 'Ovo') {
            return res.status(400).json({ message: 'Você já tem um bichinho chocado!' });
        }

        // Atualiza o pet existente ou cria um novo se não existir (para o caso de não ter sido criado no registro)
        const petData = {
            ownerId: userId,
            name: name || 'Seu Novo RunGO',
            stage: 'Filhote',
            happiness: 70, // Começa feliz!
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

        await petDocRef.set(petData, { merge: true }); // set com merge para atualizar se já existir

        const newPetDoc = await petDocRef.get(); // Obter o documento atualizado
        res.status(200).json(newPetDoc.data());
    } catch (err) {
        console.error('Erro ao chocar pet:', err);
        res.status(500).json({ message: err.message });
    }
});

// Rota para atualizar a felicidade do bichinho com base nos passos
router.post('/updateHappiness', async (req, res) => {
    const { steps } = req.body; // Passos recebidos do frontend

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

        // Lógica para aumentar a felicidade e total de passos
        const happinessIncrease = Math.floor(steps / 100); // Ex: cada 100 passos = 1 ponto de felicidade
        petData.happiness = Math.min(100, petData.happiness + happinessIncrease);

        // Aumentar o total de passos na vida do pet
        petData.totalStepsLife += steps;

        // Lógica de evolução
        // Se ainda for ovo, não evolui com passos, apenas choca. A evolução real começa como filhote.
        if (petData.stage === 'Filhote' && petData.totalStepsLife >= 10000 && petData.evolutionProgress < 1) {
            petData.stage = 'Adulto';
            petData.happiness = Math.min(100, petData.happiness + 20); // Bônus de felicidade ao evoluir
            petData.evolutionProgress = 1; // Marca como evoluído para esta fase
            await petDocRef.update(petData); // Salva as mudanças de estágio imediatamente
            const updatedPetDoc = await petDocRef.get(); // Recarrega
            return res.json({ message: 'Seu bichinho evoluiu para Adulto!', ...updatedPetDoc.data() });
        } else if (petData.stage === 'Adulto' && petData.totalStepsLife >= 50000 && petData.evolutionProgress < 2) {
            petData.stage = 'Idoso';
            petData.happiness = Math.min(100, petData.happiness + 10);
            petData.evolutionProgress = 2;
            await petDocRef.update(petData); // Salva as mudanças de estágio imediatamente
            const updatedPetDoc = await petDocRef.get(); // Recarrega
            return res.json({ message: 'Seu bichinho evoluiu para Idoso!', ...updatedPetDoc.data() });
        }

        // Atualizar a data da última atualização de passos
        petData.lastStepsUpdate = new Date();

        await petDocRef.update({
            happiness: petData.happiness,
            totalStepsLife: petData.totalStepsLife,
            lastStepsUpdate: petData.lastStepsUpdate,
            // stage e evolutionProgress só são atualizados no bloco if acima
        });

        const updatedPetDoc = await petDocRef.get(); // Obter o documento atualizado
        res.json(updatedPetDoc.data());
    } catch (err) {
        console.error('Erro ao atualizar felicidade do pet:', err);
        res.status(500).json({ message: err.message });
    }
});


// Rotas para ações do bichinho
router.post('/feed', async (req, res) => {
    try {
        const userId = req.user.id;
        const petDocRef = db.collection(PETS_COLLECTION).doc(userId);
        const petDoc = await petDocRef.get();
        if (!petDoc.exists) return res.status(404).json({ message: 'Bichinho não encontrado.' });

        let petData = petDoc.data();
        petData.fome = Math.max(0, petData.fome - 30); // Diminui fome
        petData.happiness = Math.min(100, petData.happiness + 15);
        petData.energia = Math.min(100, petData.energia + 5);
        petData.lastFed = new Date(); // Atualiza tempo da última alimentação

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
        petData.fome = Math.min(100, petData.fome + 5);
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
        console.error('Erro ao fazer pet dormir:', err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/hatch', auth, async (req, res) => {
  const { name, dinosaurId } = req.body; // Recebe o dinosaurId
  const userId = req.user.id; // Supondo que seu middleware auth adiciona user.id

  try {
    let pet = await Pet.findOne({ userId });

    if (pet) {
      return res.status(400).json({ message: 'Você já tem um bichinho chocado!' });
    }

    pet = new Pet({
      userId,
      name,
      dinosaurId, // Salva o dinosaurId
      stage: 'Filhote', // Começa como filhote após chocar
      happiness: 100,
      fome: 100,
      energia: 100,
      totalStepsLife: 0,
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

router.post('/archive/:petId', auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user.id;

    const pet = await Pet.findOne({ _id: petId, userId });

    if (!pet) {
      return res.status(404).json({ message: 'Bichinho não encontrado ou não pertence ao usuário.' });
    }

    // Verifica se o pet já está no estágio idoso antes de arquivar
    if (pet.stage !== 'Idoso') {
        return res.status(400).json({ message: 'Bichinho ainda não atingiu o estágio idoso para ser colecionado.' });
    }

    // Cria um registro na coleção de pets coletados
    const collectedPet = new CollectedPet({
      userId: userId,
      petId: pet._id,
      name: pet.name,
      dinosaurId: pet.dinosaurId,
      // Você pode copiar outros atributos importantes aqui se quiser
    });
    await collectedPet.save();

    // Opcional: Remover o pet ativo do usuário ou marcá-lo como inativo
    await Pet.deleteOne({ _id: petId }); // Exemplo: Deleta o pet ativo

    res.status(200).json({ message: 'Bichinho arquivado com sucesso para sua coleção!', collectedPet });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor ao arquivar bichinho.');
  }
});

router.get('/collection', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const collectedDinos = await CollectedPet.find({ userId }); // Busca todos os pets colecionados pelo usuário

    res.status(200).json(collectedDinos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor ao buscar coleção.');
  }
});
module.exports = router;