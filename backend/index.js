const express = require('express');
const cors = require('cors');
const rutas = require('./rutas');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas las rutas

// Usar las rutas definidas
app.use('/api', rutas);

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err);  // Imprime el error en la consola
  res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});