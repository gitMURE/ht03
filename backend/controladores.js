const db = require('./db');  // Tu conexión a la base de datos

// Verifica que el módulo se esté cargando correctamente
console.log('Módulo controladores cargado');

const login = async (req, res) => {
  console.log('Función login ejecutada');
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan datos de entrada' });
  }

  try {
    // Buscar al usuario por nombre de usuario
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    
    // Verifica si encontramos algún usuario
    if (!usuarios || usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
    
    const usuario = usuarios[0];
    console.log('Usuario encontrado:', usuario);
    
    // Verificar la contraseña (comparación con contrasena_hash en lugar de contrasena)
    if (usuario.contrasena_hash === contrasena) {
      // Eliminar la contraseña antes de enviar los datos del usuario
      const { contrasena_hash, ...usuarioSinContrasena } = usuario;
      return res.status(200).json({ 
        mensaje: 'Login exitoso', 
        usuario: usuarioSinContrasena 
      });
    } else {
      console.log('Contraseña incorrecta. Esperaba:', usuario.contrasena_hash, 'Recibió:', contrasena);
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// Verifica que la función login sea exportada correctamente
console.log('Tipo de login:', typeof login);

// Exporta la función login
module.exports = { login };

// Verifica la exportación
console.log('Exportación de controladores:', module.exports);