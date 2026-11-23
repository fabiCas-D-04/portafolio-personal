const Project = require('../models/Project');
const { validateProject } = require('../utils/validate');

/** GET /api/projects  (filtro opcional ?tech=react) */
async function getProjects(req, res, next) {
  try {
    const filter = {};
    if (req.query.tech) filter.tech = { $in: [req.query.tech] };
    if (req.query.category) filter.category = req.query.category;

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

/** GET /api/projects/:id */
async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Proyecto no encontrado' });
    next(err);
  }
}

/** POST /api/projects */
async function createProject(req, res, next) {
  try {
    const { valid, errors } = validateProject(req.body);
    if (!valid) return res.status(400).json({ error: 'Datos inválidos', details: errors });

    const project = await Project.create({
      title: String(req.body.title).trim(),
      description: String(req.body.description).trim(),
      tech: Array.isArray(req.body.tech) ? req.body.tech : [],
      url: req.body.url || '',
      category: req.body.category || 'otro',
      featured: Boolean(req.body.featured),
    });

    res.status(201).json(project);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos', details: err.errors && Object.keys(err.errors) });
    }
    next(err);
  }
}

/** DELETE /api/projects/:id */
async function deleteProject(req, res, next) {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Proyecto no encontrado' });
    next(err);
  }
}

module.exports = { getProjects, getProjectById, createProject, deleteProject };
