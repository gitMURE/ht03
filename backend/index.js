const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors()); 

// Importar rutas después de configurar middleware
const rutas = require('./rutas');

// Verificar que rutas sea un Router de Express
console.log('Tipo de rutas:', typeof rutas);
console.log('¿Es rutas un Router?', rutas && typeof rutas.use === 'function');

// Usar las rutas
app.use('/api', rutas);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err); 
  res.status(500).json({ mensaje: 'Hubo un error en el servidor', error: err.message });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});