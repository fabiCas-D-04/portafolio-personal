const Contact = require('../models/Contact');
const { validateContact } = require('../utils/validate');

/** POST /api/contact */
async function createMessage(req, res, next) {
  try {
    const { valid, errors } = validateContact(req.body);
    if (!valid) return res.status(400).json({ error: 'Datos inválidos', details: errors });

    const contact = await Contact.create({
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim().toLowerCase(),
      message: String(req.body.message).trim(),
    });

    res.status(201).json({ ok: true, id: contact._id, mensaje: 'Mensaje recibido, ¡gracias!' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos', details: Object.keys(err.errors || {}) });
    }
    next(err);
  }
}

/** GET /api/contact (solo lectura) */
async function getMessages(req, res, next) {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = { createMessage, getMessages };
