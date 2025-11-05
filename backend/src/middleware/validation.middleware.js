const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Ejecutar todas las validaciones
    await Promise.all(validations.map(validation => validation.run(req)));

    // Obtener errores
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Retornar errores
    res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  };
};

// Validaciones para registro
const registerValidation = validate([
  body('username')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('fullName')
    .trim()
    .optional()
    .isLength({ max: 200 })
    .withMessage('El nombre completo no puede exceder 200 caracteres')
]);

// Validaciones para login
const loginValidation = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
]);

// Validaciones para iniciar examen
const startExamValidation = validate([
  body('examType')
    .isIn(['Practice', 'Final'])
    .withMessage('El tipo de examen debe ser Practice o Final')
]);

// Validaciones para enviar respuesta
const submitAnswerValidation = validate([
  body('examId')
    .isInt()
    .withMessage('El ID del examen debe ser un número entero'),
  body('questionId')
    .isInt()
    .withMessage('El ID de la pregunta debe ser un número entero'),
  body('selectedAnswer')
    .optional()
    .isIn(['a', 'b', 'c', 'd', 'x'])
    .withMessage('La respuesta debe ser a, b, c, d o x (timeout)'),
  body('timeTakenSeconds')
    .isInt({ min: 0 })
    .withMessage('El tiempo debe ser un número entero positivo')
]);

// Validaciones para finalizar examen
const finishExamValidation = validate([
  body('examId')
    .isInt()
    .withMessage('El ID del examen debe ser un número entero')
]);

module.exports = {
  registerValidation,
  loginValidation,
  startExamValidation,
  submitAnswerValidation,
  finishExamValidation
};
