const QuestionModel = require('../models/question.model');

class QuestionController {
  // Obtener todas las preguntas (solo para admin/desarrollo)
  static async getAll(req, res) {
    try {
      const questions = await QuestionModel.getAll();

      res.json({
        success: true,
        data: questions
      });
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener preguntas',
        error: error.message
      });
    }
  }

  // Obtener preguntas por nivel
  static async getByLevel(req, res) {
    try {
      const { levelName } = req.params;

      const questions = await QuestionModel.getByLevel(levelName);

      res.json({
        success: true,
        data: questions
      });
    } catch (error) {
      console.error('Error al obtener preguntas por nivel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener preguntas por nivel',
        error: error.message
      });
    }
  }

  // Obtener todos los niveles
  static async getAllLevels(req, res) {
    try {
      const levels = await QuestionModel.getAllLevels();

      res.json({
        success: true,
        data: levels
      });
    } catch (error) {
      console.error('Error al obtener niveles:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener niveles',
        error: error.message
      });
    }
  }

  // Obtener pregunta por ID
  static async getById(req, res) {
    try {
      const { questionId } = req.params;

      const question = await QuestionModel.findById(questionId);
      
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada'
        });
      }

      res.json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error al obtener pregunta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pregunta',
        error: error.message
      });
    }
  }
}

module.exports = QuestionController;
