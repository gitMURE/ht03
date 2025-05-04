const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); 
const rutas = require('./rutas');
app.use('/api', rutas);
app.use((err, req, res, next) => {
  console.error('Error global:', err); 
  res.status(500).json({ mensaje: 'Hubo un error en el servidor', error: err.message });
});
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});