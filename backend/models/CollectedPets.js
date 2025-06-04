// Exemplo: src/models/CollectedPet.js
const mongoose = require('mongoose');

const CollectedPetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true, unique: true }, // Referência ao Pet original
  name: { type: String, required: true },
  dinosaurId: { type: String, required: true }, // Qual dinossauro foi colecionado
  collectedAt: { type: Date, default: Date.now },
  // Você pode adicionar outros atributos do pet no momento da coleta se quiser mantê-los
});

module.exports = mongoose.model('CollectedPet', CollectedPetSchema);