const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
} = require('../controllers/projectController');

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProject);

module.exports = router;
