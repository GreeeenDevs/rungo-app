// Exemplo: src/models/Pet.js (se você tiver um)
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  happiness: { type: Number, default: 100 },
  fome: { type: Number, default: 100 },
  energia: { type: Number, default: 100 },
  stage: { type: String, enum: ['Ovo', 'Filhote', 'Adulto', 'Idoso'], default: 'Ovo' },
  totalStepsLife: { type: Number, default: 0 },
  // NOVO CAMPO: Para armazenar qual dinossauro o pet representa
  dinosaurId: { type: String, default: 'default_egg' }, // Ex: 'dino_azul', 'dino_raro', etc.
  lastInteraction: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pet', PetSchema);