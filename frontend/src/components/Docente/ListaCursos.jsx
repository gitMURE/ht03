import React, { useState, useEffect } from 'react';

const ListaCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cursos');
        
        if (!response.ok) {
          throw new Error('Error al obtener cursos');
        }
        
        const data = await response.json();
        
        // Transformar los datos para incluir los estudiantes inscritos
        const cursosConEstudiantes = await Promise.all((data.cursos || []).map(async (curso) => {
          // Obtener los estudiantes del curso
          const estudiantesResponse = await fetch(`http://localhost:3000/api/cursos/${curso.id}/estudiantes`);
          
          if (estudiantesResponse.ok) {
            const estudiantesData = await estudiantesResponse.json();
            return {
              ...curso,
              estudiantes: Array.isArray(estudiantesData.estudiantes) ? estudiantesData.estudiantes.map(est => ({
                id: est.id,
                nombre: `${est.nombres} ${est.apellidos}`
              })) : []
            };
          }
          
          return {
            ...curso,
            estudiantes: []
          };
        }));
        
        setCursos(cursosConEstudiantes);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) return <div>Cargando cursos...</div>;

  return (
    <div className="lista-cursos">
      <h2>Lista de Cursos</h2>
      {cursos.length === 0 ? (
        <p>No hay cursos registrados.</p>
      ) : (
        <div className="cursos-container">
          {cursos.map(curso => (
            <div key={curso.id} className="curso-card">
              <h3>{curso.nombre}</h3>
              <p>{curso.descripcion}</p>
              <div className="estudiantes-inscritos">
                <h4>Estudiantes Inscritos ({curso.estudiantes.length})</h4>
                {curso.estudiantes.length > 0 ? (
                  <ul>
                    {curso.estudiantes.map(est => (
                      <li key={est.id}>{est.nombre}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay estudiantes inscritos</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaCursos;