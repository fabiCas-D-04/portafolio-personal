require('dotenv').config();
const express = require('express');
const cors = require('cors');

const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'portfolio-api',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
