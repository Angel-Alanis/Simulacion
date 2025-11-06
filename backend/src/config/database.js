const sql = require('mssql');
require('dotenv').config();

// Configuración de conexión a SQL Server
const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: process.env.DB_USE_WINDOWS_AUTH === 'true',
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

// Autenticación SQL Server o Windows
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
      console.log('Conectado a SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('Error al conectar con SQL Server:', error);
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
