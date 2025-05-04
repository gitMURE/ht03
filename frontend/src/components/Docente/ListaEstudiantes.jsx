import React, { useState, useEffect } from 'react';

const ListaEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/estudiantes');
        
        if (!response.ok) {
          throw new Error('Error al obtener estudiantes');
        }
        
        const data = await response.json();
        
        // Transformar los datos para incluir los cursos
        const estudiantesConCursos = await Promise.all((data.estudiantes || []).map(async (estudiante) => {
          // Obtener los cursos del estudiante
          const cursosResponse = await fetch(`http://localhost:3000/api/estudiantes/${estudiante.id}/cursos`);
          
          if (cursosResponse.ok) {
            const cursosData = await cursosResponse.json();
            return {
              ...estudiante,
              cursos: (cursosData.cursos || []).map(curso => curso.nombre)
            };
          }
          
          return {
            ...estudiante,
            cursos: []
          };
        }));
        
        setEstudiantes(estudiantesConCursos);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  if (loading) return <div>Cargando estudiantes...</div>;

  return (
    <div className="lista-estudiantes">
      <h2>Lista de Estudiantes</h2>
      {estudiantes.length === 0 ? (
        <p>No hay estudiantes registrados.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Cursos Inscritos</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(est => (
                <tr key={est.id}>
                  <td>{est.id}</td>
                  <td>{est.nombres} {est.apellidos}</td>
                  <td>{est.correo_electronico}</td>
                  <td>
                    {est.cursos.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaEstudiantes;