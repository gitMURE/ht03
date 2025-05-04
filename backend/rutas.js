const express = require('express');
const controladores = require('./controladores');

const router = express.Router();

// Rutas de autenticación
router.post('/login', controladores.login);

// Rutas para estudiantes
router.get('/estudiantes/:estudiante_id/cursos', controladores.obtenerCursosEstudiante);

// Rutas para cursos
router.get('/cursos/:curso_id/estudiantes', controladores.obtenerEstudiantesCurso);

// Rutas para docentes
router.post('/estudiantes', controladores.registrarEstudiante);
router.post('/cursos', controladores.registrarCurso);
router.post('/inscripciones', controladores.inscribirEstudiante);
router.get('/estudiantes', controladores.obtenerEstudiantes);
router.get('/cursos', controladores.obtenerCursos);

module.exports = router;