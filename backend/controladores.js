const db = require('./db');  // Tu conexión a la base de datos

const login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan datos de entrada' });
  }

  // Buscar al usuario por nombre de usuario
  const [usuario] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Usuario no encontrado' });
  }

  // Verificar la contraseña (sin encriptación por ahora, sólo comparación directa)
  if (usuario.contrasena === contrasena) {
    return res.status(200).json({ mensaje: 'Login exitoso', usuario });
  } else {
    return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
  }
};

module.exports = { login };