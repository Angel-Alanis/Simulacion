-- Script de creación de base de datos para el Simulador de Examen de Inglés
-- SQL Server

-- Crear la base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EnglishExamDB')
BEGIN
    CREATE DATABASE EnglishExamDB;
END
GO

USE EnglishExamDB;
GO

-- Tabla de Niveles (3 niveles: Basico, Intermedio, Avanzado)
CREATE TABLE Levels (
    level_id INT PRIMARY KEY IDENTITY(1,1),
    level_name VARCHAR(50) NOT NULL UNIQUE,
    level_order INT NOT NULL,
    min_percentage DECIMAL(5,2) NOT NULL,
    max_percentage DECIMAL(5,2) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);

-- Tabla de Preguntas
CREATE TABLE Questions (
    question_id INT PRIMARY KEY IDENTITY(1,1),
    level_id INT NOT NULL,
    question_number INT NOT NULL,
    question_text NVARCHAR(MAX) NOT NULL,
    option_a NVARCHAR(500) NOT NULL,
    option_b NVARCHAR(500) NOT NULL,
    option_c NVARCHAR(500) NOT NULL,
    option_d NVARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
    has_context BIT DEFAULT 0,
    context_text NVARCHAR(MAX),
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (level_id) REFERENCES Levels(level_id),
    CONSTRAINT UQ_Level_Question UNIQUE (level_id, question_number)
);

-- Tabla de Usuarios
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name NVARCHAR(200),
    current_level_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (current_level_id) REFERENCES Levels(level_id)
);

-- Tabla de Tipos de Examen
CREATE TABLE ExamTypes (
    exam_type_id INT PRIMARY KEY IDENTITY(1,1),
    type_name VARCHAR(50) NOT NULL UNIQUE,
    total_questions INT NOT NULL,
    max_attempts INT NOT NULL,
    points_per_question DECIMAL(5,2) NOT NULL,
    passing_score DECIMAL(5,2) NOT NULL,
    time_limit_seconds INT NOT NULL,
    description VARCHAR(255)
);

-- Tabla de Exámenes Realizados
CREATE TABLE Exams (
    exam_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    exam_type_id INT NOT NULL,
    start_time DATETIME NOT NULL DEFAULT GETDATE(),
    end_time DATETIME,
    total_score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    passed BIT,
    level_achieved_id INT,
    attempt_number INT NOT NULL,
    is_completed BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (exam_type_id) REFERENCES ExamTypes(exam_type_id),
    FOREIGN KEY (level_achieved_id) REFERENCES Levels(level_id)
);

-- Tabla de Respuestas del Usuario
CREATE TABLE UserAnswers (
    answer_id INT PRIMARY KEY IDENTITY(1,1),
    exam_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_answer CHAR(1) CHECK (selected_answer IN ('a', 'b', 'c', 'd', 'x')), -- 'x' para timeout
    is_correct BIT NOT NULL,
    time_taken_seconds INT NOT NULL,
    answered_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id),
    CONSTRAINT UQ_Exam_Question UNIQUE (exam_id, question_id)
);

-- Tabla de Preguntas por Examen (para tracking de preguntas asignadas)
CREATE TABLE ExamQuestions (
    exam_question_id INT PRIMARY KEY IDENTITY(1,1),
    exam_id INT NOT NULL,
    question_id INT NOT NULL,
    question_order INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id),
    CONSTRAINT UQ_Exam_Question_Order UNIQUE (exam_id, question_order)
);

-- Tabla de Estadísticas por Usuario
CREATE TABLE UserStatistics (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    total_practice_attempts INT DEFAULT 0,
    total_final_attempts INT DEFAULT 0,
    best_practice_score DECIMAL(5,2),
    best_final_score DECIMAL(5,2),
    average_practice_score DECIMAL(5,2),
    average_final_score DECIMAL(5,2),
    total_questions_answered INT DEFAULT 0,
    total_correct_answers INT DEFAULT 0,
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IX_Questions_Level ON Questions(level_id);
CREATE INDEX IX_Exams_User ON Exams(user_id);
CREATE INDEX IX_Exams_Type ON Exams(exam_type_id);
CREATE INDEX IX_UserAnswers_Exam ON UserAnswers(exam_id);
CREATE INDEX IX_UserAnswers_Question ON UserAnswers(question_id);
CREATE INDEX IX_ExamQuestions_Exam ON ExamQuestions(exam_id);
GO

-- Vista para estadísticas del dashboard
CREATE VIEW vw_DashboardStats AS
SELECT 
    u.user_id,
    u.username,
    u.full_name,
    l.level_name as current_level,
    us.total_practice_attempts,
    us.total_final_attempts,
    us.best_practice_score,
    us.best_final_score,
    us.average_practice_score,
    us.average_final_score,
    us.total_questions_answered,
    us.total_correct_answers,
    CASE 
        WHEN us.total_questions_answered > 0 
        THEN CAST(us.total_correct_answers AS DECIMAL(5,2)) / us.total_questions_answered * 100 
        ELSE 0 
    END as accuracy_percentage
FROM Users u
LEFT JOIN Levels l ON u.current_level_id = l.level_id
LEFT JOIN UserStatistics us ON u.user_id = us.user_id;

GO

PRINT 'Base de datos creada exitosamente';
