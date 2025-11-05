const sql = require('mssql');
require('dotenv').config();

// Configuración para Windows Authentication o SQL Server Authentication
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port: 1433, // Puerto TCP/IP estándar
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: process.env.DB_USE_WINDOWS_AUTH === 'true', // Windows Authentication
    useUTC: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

// Si NO es Windows Authentication, agregar user y password
if (process.env.DB_USE_WINDOWS_AUTH !== 'true') {
  config.authentication = {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  };
} else {
  config.authentication = {
    type: 'ntlm',
    options: {
      domain: '',
      userName: '',
      password: ''
    }
  };
}

let pool = null;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conectado a SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con SQL Server:', error);
    throw error;
  }
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('Error al cerrar la conexión:', error);
  }
};

module.exports = {
  sql,
  getConnection,
  closeConnection
};
