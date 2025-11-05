const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

class UserController {
  // Registro de usuario
  static async register(req, res) {
    try {
      const { username, email, password, fullName } = req.body;

      // Validar que no exista el usuario
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya existe'
        });
      }

      // Validar que no exista el email
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Crear usuario
      const user = await UserModel.create({
        username,
        email,
        password,
        fullName
      });

      // Crear estadísticas iniciales
      await UserModel.getOrCreateStats(user.user_id);

      // Generar token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            fullName: user.full_name
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  }

  // Login de usuario
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      console.log('🔐 Intento de login:', { username, password: '***' });

      // Buscar usuario por username o email
      let user = await UserModel.findByUsername(username);
      if (!user) {
        // Si no se encuentra por username, buscar por email
        user = await UserModel.findByEmail(username);
      }
      
      console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            currentLevel: user.current_level_name
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  }

  // Obtener perfil de usuario
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const stats = await UserModel.getOrCreateStats(userId);

      res.json({
        success: true,
        data: {
          user: {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            currentLevel: user.current_level_name
          },
          statistics: stats
        }
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener perfil',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
