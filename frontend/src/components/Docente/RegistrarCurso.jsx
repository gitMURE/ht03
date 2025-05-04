import React, { useState } from 'react';
import Swal from 'sweetalert2';

const RegistrarCurso = ({ docenteId }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
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
      const cursoData = {
        ...formData,
        docente_id: docenteId
      };
      
      console.log('Enviando datos del curso:', cursoData);
      
      const response = await fetch('http://localhost:3000/api/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cursoData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire('Éxito', 'Curso registrado correctamente', 'success');
        // Limpiar formulario
        setFormData({
          nombre: '',
          descripcion: ''
        });
      } else {
        Swal.fire('Error', data.mensaje || 'No se pudo registrar el curso', 'error');
      }
    } catch (error) {
      console.error('Error al registrar curso:', error);
      Swal.fire('Error', 'No se pudo registrar el curso', 'error');
    }
  };

  return (
    <div className="registrar-curso">
      <h2>Registrar Nuevo Curso</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Curso</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <button type="submit" className="btn-submit">Registrar Curso</button>
      </form>
    </div>
  );
};

export default RegistrarCurso;