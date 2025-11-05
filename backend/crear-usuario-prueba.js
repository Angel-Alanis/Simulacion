const bcrypt = require('bcryptjs');
const { getConnection, sql } = require('./src/config/database');

async function crearUsuarioPrueba() {
  try {
    console.log('🔧 Creando usuario de prueba...');
    
    // Hashear la contraseña "Test123!"
    const hashedPassword = await bcrypt.hash('Test123!', 10);
    console.log('🔐 Contraseña hasheada:', hashedPassword);
    
    const pool = await getConnection();
    
    // Eliminar usuario de prueba si existe
    await pool.request()
      .input('email', sql.VarChar(150), 'test@test.com')
      .query('DELETE FROM Users WHERE email = @email');
    
    console.log('🗑️  Usuario anterior eliminado (si existía)');
    
    // Crear nuevo usuario
    const result = await pool.request()
      .input('username', sql.VarChar(100), 'test@test.com')
      .input('email', sql.VarChar(150), 'test@test.com')
      .input('passwordHash', sql.VarChar(255), hashedPassword)
      .input('fullName', sql.NVarChar(200), 'Usuario de Prueba')
      .query(`
        INSERT INTO Users (username, email, password_hash, full_name)
        OUTPUT INSERTED.*
        VALUES (@username, @email, @passwordHash, @fullName)
      `);
    
    console.log('✅ Usuario creado exitosamente:');
    console.log('   Email: test@test.com');
    console.log('   Password: Test123!');
    console.log('   Datos:', result.recordset[0]);
    
    // Crear estadísticas
    const userId = result.recordset[0].user_id;
    await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM UserStatistics WHERE user_id = @userId)
        BEGIN
          INSERT INTO UserStatistics (user_id)
          VALUES (@userId)
        END
      `);
    
    console.log('✅ Estadísticas creadas');
    console.log('\n🎉 ¡Listo! Puedes iniciar sesión con:');
    console.log('   Email: test@test.com');
    console.log('   Password: Test123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearUsuarioPrueba();
