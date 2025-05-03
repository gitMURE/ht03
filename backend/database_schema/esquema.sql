-- ============================= CREACIÓN DE TABLAS =============================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena_hash TEXT NOT NULL,
    rol ENUM('estudiante', 'docente') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE docentes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    docente_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (docente_id) REFERENCES docentes(id) ON DELETE SET NULL
);
CREATE TABLE inscripciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT NOT NULL,
    curso_id INT NOT NULL,
    inscrito_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY (estudiante_id, curso_id)
);
-- ============================= INSERTAR DATOS DE PRUEBA =============================
INSERT INTO usuarios (nombre_usuario, contrasena_hash, rol) VALUES
('estudiante1', 'hash1', 'estudiante'),
('estudiante2', 'hash2', 'estudiante'),
('estudiante3', 'hash3', 'estudiante'),
('docente1', 'hash4', 'docente'),
('docente2', 'hash5', 'docente'),
('docente3', 'hash6', 'docente');

-- INSERTAR ESTUDIANTES
INSERT INTO estudiantes (usuario_id, nombres, apellidos, correo_electronico) VALUES
(1, 'Leonardo', 'Muñoz', 'leonardo@gmail.com'),
(2, 'Rubi', 'Vasquez', 'rubi@gmail.com'),
(3, 'Jose', 'Castillo', 'jose@gmail.com');

-- INSERTAR DOCENTES
INSERT INTO docentes (usuario_id, nombres, apellidos, correo_electronico) VALUES
(4, 'Franz', 'Rodríguez', 'franz@gmail.com'),
(5, 'Carlos', 'López', 'carlos.lopez@example.com'),
(6, 'Laura', 'Fernández', 'laura.fernandez@example.com');

-- INSERTAR CURSOS
INSERT INTO cursos (nombre, descripcion, docente_id) VALUES
('Introducción a la Programación', 'Curso básico de programación', 1),        -- docente_id 1 (María)
('Estructuras de Datos', 'Estudio de estructuras como listas, pilas, colas', 2), -- docente_id 2 (Carlos)
('Bases de Datos', 'Diseño y manejo de bases de datos relacionales', 2),
('Programación Web', 'Desarrollo web con HTML, CSS y JavaScript', 3),          -- docente_id 3 (Laura)
('Algoritmos Avanzados', 'Optimización y análisis de algoritmos complejos', 3);

-- INSCRIPCIONES (ESTUDIANTES EN DISTINTOS CURSOS)
INSERT INTO inscripciones (estudiante_id, curso_id) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 1),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(3, 5);

