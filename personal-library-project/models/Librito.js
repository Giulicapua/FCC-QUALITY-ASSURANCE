const mongoose = require('mongoose');

const libritoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  comentarios: [{
    texto: String,
    fecha: { type: Date, default: Date.now }
  }],
  totalComentarios: {
    type: Number,
    default: 0
  }
});

libritoSchema.pre('save', function(next) {
  this.totalComentarios = this.comentarios.length;
  next();
});

module.exports = mongoose.model('Librito', libritoSchema);