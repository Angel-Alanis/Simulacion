const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas del dashboard requieren autenticación
router.use(authMiddleware);

// Obtener estadísticas generales
router.get('/statistics', DashboardController.getStatistics);

// Obtener gráficas de progreso
router.get('/progress', DashboardController.getProgressCharts);

// Obtener análisis práctica vs final
router.get('/analysis', DashboardController.getPracticeFinalAnalysis);

module.exports = router;
