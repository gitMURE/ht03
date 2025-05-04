import React, { useState } from 'react';
import Swal from 'sweetalert2';

const RegistrarEstudiante = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
    nombres: '',
    apellidos: '',
    correo_electronico: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar datos para enviar
      const estudianteData = {
        ...formData,
        rol: 'estudiante' // Aseguramos que se registre como estudiante
      };
      
      console.log('Enviando datos del estudiante:', estudianteData);
      
      const response = await fetch('http://localhost:3000/api/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estudianteData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire('Éxito', 'Estudiante registrado correctamente', 'success');
        // Limpiar formulario
        setFormData({
          nombre_usuario: '',
          contrasena: '',
          nombres: '',
          apellidos: '',
          correo_electronico: ''
        });
      } else {
        Swal.fire('Error', data.mensaje || 'No se pudo registrar el estudiante', 'error');
      }
    } catch (error) {
      console.error('Error al registrar estudiante:', error);
      Swal.fire('Error', 'No se pudo registrar el estudiante', 'error');
    }
  };

  return (
    <div className="registrar-estudiante">
      <h2>Registrar Nuevo Estudiante</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de Usuario</label>
          <input
            type="text"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="correo_electronico"
            value={formData.correo_electronico}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-submit">Registrar Estudiante</button>
      </form>
    </div>
  );
};

export default RegistrarEstudiante;