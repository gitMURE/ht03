const express = require('express');
const controladores = require('./controladores');

const router = express.Router();

// Verifica que controladores.login sea una función antes de usarla
console.log('Tipo de controladores.login:', typeof controladores.login);

// Asegúrate de que controladores.login sea una función
if (typeof controladores.login === 'function') {
  router.post('/login', controladores.login);
} else {
  console.error('ERROR: controladores.login no es una función válida');
  // Fallback temporal con una función vacía para evitar el error
  router.post('/login', (req, res) => {
    res.status(500).json({ mensaje: 'Error de configuración en el servidor' });
  });
}

module.exports = router;