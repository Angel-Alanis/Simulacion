const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/exam.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { 
  startExamValidation, 
  submitAnswerValidation, 
  finishExamValidation 
} = require('../middleware/validation.middleware');

// Todas las rutas de examen requieren autenticación
router.use(authMiddleware);

// Iniciar nuevo examen
router.post('/start', startExamValidation, ExamController.startExam);

// Enviar respuesta
router.post('/answer', submitAnswerValidation, ExamController.submitAnswer);

// Finalizar examen
router.post('/finish', finishExamValidation, ExamController.finishExam);

// Obtener historial de exámenes
router.get('/history', ExamController.getHistory);

// Obtener detalles de un examen específico
router.get('/:examId', ExamController.getExamDetails);

module.exports = router;
