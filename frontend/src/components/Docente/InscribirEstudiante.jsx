import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const InscribirEstudiante = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    curso_id: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener lista de estudiantes
        const estudiantesResponse = await fetch('http://localhost:3000/api/estudiantes');
        if (!estudiantesResponse.ok) {
          throw new Error('Error al obtener estudiantes');
        }
        const estudiantesData = await estudiantesResponse.json();
        
        // Obtener lista de cursos
        const cursosResponse = await fetch('http://localhost:3000/api/cursos');
        if (!cursosResponse.ok) {
          throw new Error('Error al obtener cursos');
        }
        const cursosData = await cursosResponse.json();
        
        setEstudiantes(estudiantesData.estudiantes || []);
        setCursos(cursosData.cursos || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos necesarios', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando datos de inscripción:', formData);
      
      const response = await fetch('http://localhost:3000/api/inscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire('Éxito', 'Estudiante inscrito correctamente', 'success');
        // Resetear selección
        setFormData({
          estudiante_id: '',
          curso_id: ''
        });
      } else {
        Swal.fire('Error', data.mensaje || 'No se pudo inscribir al estudiante', 'error');
      }
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      Swal.fire('Error', 'No se pudo inscribir al estudiante', 'error');
    }
  };

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="inscribir-estudiante">
      <h2>Inscribir Estudiante en Curso</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Seleccionar Estudiante</label>
          <select
            name="estudiante_id"
            value={formData.estudiante_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un estudiante --</option>
            {estudiantes.map(est => (
              <option key={est.id} value={est.id}>
                {est.nombres} {est.apellidos}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Seleccionar Curso</label>
          <select
            name="curso_id"
            value={formData.curso_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un curso --</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="btn-submit">Inscribir Estudiante</button>
      </form>
    </div>
  );
};

export default InscribirEstudiante;