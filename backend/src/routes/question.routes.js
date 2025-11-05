const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/question.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

// Obtener todos los niveles
router.get('/levels', QuestionController.getAllLevels);

// Obtener preguntas por nivel (para estudio)
router.get('/level/:levelName', QuestionController.getByLevel);

// Obtener pregunta específica por ID
router.get('/:questionId', QuestionController.getById);

// Obtener todas las preguntas (solo para desarrollo/admin)
router.get('/', QuestionController.getAll);

module.exports = router;
