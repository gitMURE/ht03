const bcrypt = require('bcryptjs');

// Crear un hash de la contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Ejemplo para crear hash de una contraseña
const password = "hash1";
hashPassword(password).then(console.log);
