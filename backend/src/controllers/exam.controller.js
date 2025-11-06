const ExamModel = require('../models/exam.model');
const UserModel = require('../models/user.model');

class ExamController {
  // Crear y comenzar un examen
  static async startExam(req, res) {
    try {
      const userId = req.user.userId;
      const { examType, levelId } = req.body;

      // Validar tipo de examen
      const examTypeData = await ExamModel.getExamTypeByName(examType);
      if (!examTypeData) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de examen inválido'
        });
      }

      // Verificar límite de intentos
      const attempts = await ExamModel.getUserAttempts(userId, examType);
      if (attempts >= examTypeData.max_attempts) {
        return res.status(400).json({
          success: false,
          message: `Has alcanzado el máximo de intentos (${examTypeData.max_attempts}) para este tipo de examen`
        });
      }

      // Crear registro del examen
      const exam = await ExamModel.create({
        userId,
        examTypeId: examTypeData.exam_type_id,
        attemptNumber: attempts + 1
      });

      // Seleccionar preguntas al azar (con nivel específico si es Practice)
      const levelForQuestions = examType === 'Practice' ? levelId : null;
      await ExamModel.assignRandomQuestions(exam.exam_id, examTypeData.total_questions, levelForQuestions);

      // Obtener preguntas sin respuestas correctas
      const questions = await ExamModel.getExamQuestions(exam.exam_id);
      
      const questionsWithoutAnswers = questions.map(q => ({
        examQuestionId: q.exam_question_id,
        questionOrder: q.question_order,
        questionId: q.question_id,
        questionText: q.question_text,
        options: {
          a: q.option_a,
          b: q.option_b,
          c: q.option_c,
          d: q.option_d
        },
        levelName: q.level_name,
        hasContext: q.has_context,
        contextText: q.context_text,
        imageUrl: q.image_url
      }));

      res.json({
        success: true,
        message: 'Examen iniciado',
        data: {
          examId: exam.exam_id,
          examType: examType,
          attemptNumber: exam.attempt_number,
          totalQuestions: examTypeData.total_questions,
          pointsPerQuestion: examTypeData.points_per_question,
          timeLimitPerQuestion: examTypeData.time_limit_seconds,
          questions: questionsWithoutAnswers
        }
      });
    } catch (error) {
      console.error('Error al iniciar examen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar examen',
        error: error.message
      });
    }
  }

  // Guardar respuesta del usuario
  static async submitAnswer(req, res) {
    try {
      const { examId, questionId, selectedAnswer, timeTakenSeconds } = req.body;
      const userId = req.user.userId;

      // Validar que el examen es del usuario
      const exam = await ExamModel.findById(examId);
      if (!exam || exam.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }

      if (exam.is_completed) {
        return res.status(400).json({
          success: false,
          message: 'El examen ya ha sido completado'
        });
      }

      // Registrar respuesta en BD
      const answer = await ExamModel.saveAnswer({
        examId,
        questionId,
        selectedAnswer: selectedAnswer || 'x',
        timeTakenSeconds
      });

      res.json({
        success: true,
        message: 'Respuesta guardada',
        data: {
          answerId: answer.answer_id,
          isCorrect: answer.is_correct
        }
      });
    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al guardar respuesta',
        error: error.message
      });
    }
  }

  // Completar y calcular resultados del examen
  static async finishExam(req, res) {
    try {
      const { examId } = req.body;
      const userId = req.user.userId;

      // Validar que el examen es del usuario
      const exam = await ExamModel.findById(examId);
      if (!exam || exam.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }

      if (exam.is_completed) {
        return res.status(400).json({
          success: false,
          message: 'El examen ya ha sido completado'
        });
      }

      // Finalizar examen y calcular resultados
      const results = await ExamModel.finalize(examId);

      // Obtener información del nivel alcanzado
      let levelAchieved = null;
      if (results.levelAchievedId) {
        const updatedUser = await UserModel.findById(userId);
        levelAchieved = updatedUser.current_level_name;
      }

      res.json({
        success: true,
        message: 'Examen finalizado',
        data: {
          examId,
          totalScore: results.totalScore,
          percentage: results.percentage,
          passed: results.passed,
          correctAnswers: results.correctAnswers,
          totalAnswers: results.totalAnswers,
          levelAchieved: levelAchieved,
          message: results.passed 
            ? `¡Felicidades! Has aprobado con ${results.percentage.toFixed(2)}%${levelAchieved ? ` - Nivel alcanzado: ${levelAchieved}` : ''}`
            : `No aprobaste. Obtuviste ${results.percentage.toFixed(2)}%. Necesitas 70% o más.`
        }
      });
    } catch (error) {
      console.error('Error al finalizar examen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al finalizar examen',
        error: error.message
      });
    }
  }

  // Obtener historial de exámenes
  static async getHistory(req, res) {
    try {
      const userId = req.user.userId;

      const history = await ExamModel.getUserExamHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener historial',
        error: error.message
      });
    }
  }

  // Obtener detalles de un examen específico
  static async getExamDetails(req, res) {
    try {
      const { examId } = req.params;
      const userId = req.user.userId;

      const exam = await ExamModel.findById(examId);
      if (!exam || exam.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }

      res.json({
        success: true,
        data: exam
      });
    } catch (error) {
      console.error('Error al obtener detalles del examen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener detalles del examen',
        error: error.message
      });
    }
  }
}

module.exports = ExamController;
