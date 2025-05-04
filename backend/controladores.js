const db = require('./db'); 

// Login existente
const login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan datos de entrada' });
  }

  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    if (!usuarios || usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
    const usuario = usuarios[0];
    console.log('Usuario encontrado:', usuario);
    if (usuario.contrasena_hash === contrasena) {
      const { contrasena_hash, ...usuarioSinContrasena } = usuario;
      
      // Obtener información adicional según el rol
      if (usuario.rol === 'estudiante') {
        const [estudiantes] = await db.query('SELECT * FROM estudiantes WHERE usuario_id = ?', [usuario.id]);
        if (estudiantes.length > 0) {
          usuarioSinContrasena.detalles = estudiantes[0];
        }
      } else if (usuario.rol === 'docente') {
        const [docentes] = await db.query('SELECT * FROM docentes WHERE usuario_id = ?', [usuario.id]);
        if (docentes.length > 0) {
          usuarioSinContrasena.detalles = docentes[0];
        }
      }
      
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

// Registrar estudiante
const registrarEstudiante = async (req, res) => {
  const { nombre_usuario, contrasena, nombres, apellidos, correo_electronico } = req.body;
  
  if (!nombre_usuario || !contrasena || !nombres || !apellidos || !correo_electronico) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }
  
  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Crear usuario primero
      const [resultUsuario] = await connection.query(
        'INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol) VALUES (?, ?, ?)',
        [nombre_usuario, contrasena, 'estudiante']
      );
      
      const usuarioId = resultUsuario.insertId;
      
      // Luego crear estudiante
      await connection.query(
        'INSERT INTO estudiantes (usuario_id, nombres, apellidos, correo_electronico) VALUES (?, ?, ?, ?)',
        [usuarioId, nombres, apellidos, correo_electronico]
      );
      
      await connection.commit();
      connection.release();
      
      return res.status(201).json({ 
        mensaje: 'Estudiante registrado exitosamente',
        usuario_id: usuarioId
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error al registrar estudiante:', error);
    return res.status(500).json({ mensaje: 'Error al registrar estudiante', error: error.message });
  }
};

// Registrar curso
const registrarCurso = async (req, res) => {
  const { nombre, descripcion, docente_id } = req.body;
  
  if (!nombre || !docente_id) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO cursos (nombre, descripcion, docente_id) VALUES (?, ?, ?)',
      [nombre, descripcion || '', docente_id]
    );
    
    return res.status(201).json({ 
      mensaje: 'Curso registrado exitosamente',
      curso_id: result.insertId
    });
  } catch (error) {
    console.error('Error al registrar curso:', error);
    return res.status(500).json({ mensaje: 'Error al registrar curso', error: error.message });
  }
};

// Inscribir estudiante en curso
const inscribirEstudiante = async (req, res) => {
  const { estudiante_id, curso_id } = req.body;
  
  if (!estudiante_id || !curso_id) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }
  
  try {
    await db.query(
      'INSERT INTO inscripciones (estudiante_id, curso_id) VALUES (?, ?)',
      [estudiante_id, curso_id]
    );
    
    return res.status(201).json({ mensaje: 'Estudiante inscrito exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensaje: 'El estudiante ya está inscrito en este curso' });
    }
    console.error('Error al inscribir estudiante:', error);
    return res.status(500).json({ mensaje: 'Error al inscribir estudiante', error: error.message });
  }
};

// Obtener cursos de un estudiante
const obtenerCursosEstudiante = async (req, res) => {
  const { estudiante_id } = req.params;
  
  try {
    const [cursos] = await db.query(
      `SELECT c.id, c.nombre, c.descripcion 
       FROM cursos c
       INNER JOIN inscripciones i ON c.id = i.curso_id
       WHERE i.estudiante_id = ?`,
      [estudiante_id]
    );
    
    return res.status(200).json({ cursos });
  } catch (error) {
    console.error('Error al obtener cursos del estudiante:', error);
    return res.status(500).json({ mensaje: 'Error al obtener cursos', error: error.message });
  }
};

// Obtener todos los estudiantes con sus cursos
const obtenerEstudiantes = async (req, res) => {
  try {
    const [estudiantes] = await db.query(
      `SELECT e.id, e.nombres, e.apellidos, e.correo_electronico 
       FROM estudiantes e`
    );
    
    // Para cada estudiante, obtener sus cursos
    for (let estudiante of estudiantes) {
      const [cursos] = await db.query(
        `SELECT c.nombre
         FROM cursos c
         INNER JOIN inscripciones i ON c.id = i.curso_id
         WHERE i.estudiante_id = ?`,
        [estudiante.id]
      );
      
      estudiante.cursos = cursos.map(c => c.nombre);
    }
    
    return res.status(200).json({ estudiantes });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return res.status(500).json({ mensaje: 'Error al obtener estudiantes', error: error.message });
  }
};

// Obtener todos los cursos con sus estudiantes
const obtenerCursos = async (req, res) => {
  try {
    const [cursos] = await db.query(
      `SELECT c.id, c.nombre, c.descripcion 
       FROM cursos c`
    );
    
    // Para cada curso, obtener sus estudiantes
    for (let curso of cursos) {
      const [estudiantes] = await db.query(
        `SELECT e.id, CONCAT(e.nombres, ' ', e.apellidos) as nombre
         FROM estudiantes e
         INNER JOIN inscripciones i ON e.id = i.estudiante_id
         WHERE i.curso_id = ?`,
        [curso.id]
      );
      
      curso.estudiantes = estudiantes;
    }
    
    return res.status(200).json({ cursos });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return res.status(500).json({ mensaje: 'Error al obtener cursos', error: error.message });
  }
};

// Obtener estudiantes de un curso específico
const obtenerEstudiantesCurso = async (req, res) => {
  const { curso_id } = req.params;
  
  try {
    const [estudiantes] = await db.query(
      `SELECT e.id, e.nombres, e.apellidos, e.correo_electronico 
       FROM estudiantes e
       INNER JOIN inscripciones i ON e.id = i.estudiante_id
       WHERE i.curso_id = ?`,
      [curso_id]
    );
    
    return res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    return res.status(500).json({ mensaje: 'Error al obtener estudiantes', error: error.message });
  }
};

module.exports = { 
  login, 
  registrarEstudiante, 
  registrarCurso, 
  inscribirEstudiante, 
  obtenerCursosEstudiante, 
  obtenerEstudiantes, 
  obtenerCursos,
  obtenerEstudiantesCurso 
};