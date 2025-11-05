-- Script para crear un usuario de prueba
-- Usuario: test@test.com
-- Contraseña: Test123!

USE EnglishExamDB;
GO

-- Insertar usuario de prueba
-- La contraseña 'Test123!' está hasheada con bcrypt
INSERT INTO Users (username, email, password_hash, full_name, created_at)
VALUES (
    'test@test.com',
    'test@test.com',
    '$2a$10$YourBcryptHashHere123456789012345678901234567890123456789',
    'Usuario de Prueba',
    GETDATE()
);

-- Verificar que se insertó
SELECT user_id, username, email, full_name, created_at 
FROM Users 
WHERE email = 'test@test.com';
