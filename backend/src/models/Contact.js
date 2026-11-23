const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    email: { type: String, required: [true, 'El email es obligatorio'], trim: true, lowercase: true },
    message: { type: String, required: [true, 'El mensaje es obligatorio'], trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
