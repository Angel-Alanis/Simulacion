-- Script para actualizar estadísticas de usuarios existentes
USE EnglishExamDB;
GO

-- Insertar registros iniciales en UserStatistics para usuarios que no los tengan
INSERT INTO UserStatistics (user_id)
SELECT u.user_id
FROM Users u
WHERE NOT EXISTS (SELECT 1 FROM UserStatistics WHERE user_id = u.user_id);

-- Actualizar estadísticas basándose en exámenes completados
UPDATE us
SET 
    us.total_practice_attempts = ISNULL(practice.attempts, 0),
    us.total_final_attempts = ISNULL(final.attempts, 0),
    us.best_practice_score = practice.best_score,
    us.best_final_score = final.best_score,
    us.average_practice_score = practice.avg_score,
    us.average_final_score = final.avg_score,
    us.total_questions_answered = ISNULL(answers.total_answered, 0),
    us.total_correct_answers = ISNULL(answers.total_correct, 0),
    us.updated_at = GETDATE()
FROM UserStatistics us
INNER JOIN Users u ON us.user_id = u.user_id
LEFT JOIN (
    SELECT 
        e.user_id,
        COUNT(*) as attempts,
        MAX(e.percentage) as best_score,
        AVG(e.percentage) as avg_score
    FROM Exams e
    INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
    WHERE et.type_name = 'Practice' AND e.is_completed = 1
    GROUP BY e.user_id
) practice ON u.user_id = practice.user_id
LEFT JOIN (
    SELECT 
        e.user_id,
        COUNT(*) as attempts,
        MAX(e.percentage) as best_score,
        AVG(e.percentage) as avg_score
    FROM Exams e
    INNER JOIN ExamTypes et ON e.exam_type_id = et.exam_type_id
    WHERE et.type_name = 'Final' AND e.is_completed = 1
    GROUP BY e.user_id
) final ON u.user_id = final.user_id
LEFT JOIN (
    SELECT 
        e.user_id,
        COUNT(*) as total_answered,
        SUM(CAST(ua.is_correct AS INT)) as total_correct
    FROM UserAnswers ua
    INNER JOIN Exams e ON ua.exam_id = e.exam_id
    GROUP BY e.user_id
) answers ON u.user_id = answers.user_id;

DECLARE @count INT;
SELECT @count = COUNT(*) FROM UserStatistics;
PRINT 'Estadísticas actualizadas exitosamente';
PRINT 'Total de registros en UserStatistics: ' + CAST(@count AS VARCHAR);

-- Mostrar estadísticas actualizadas
SELECT 
    u.username,
    us.total_practice_attempts,
    us.total_final_attempts,
    us.best_practice_score,
    us.best_final_score,
    us.total_questions_answered,
    us.total_correct_answers
FROM UserStatistics us
INNER JOIN Users u ON us.user_id = u.user_id;
