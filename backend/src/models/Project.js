const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'El título es obligatorio'], trim: true },
    description: { type: String, required: [true, 'La descripción es obligatoria'], trim: true },
    tech: { type: [String], default: [] },
    url: { type: String, trim: true, default: '' },
    category: { type: String, enum: ['web', 'mobile', 'ia', 'juego', 'otro'], default: 'otro' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
