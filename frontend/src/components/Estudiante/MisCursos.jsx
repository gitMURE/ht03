import React, { useState, useEffect } from 'react';

const MisCursos = ({ userId }) => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        // Obtener el ID del estudiante a partir del ID de usuario
        const estudianteResponse = await fetch(`http://localhost:3000/api/estudiantes`);
        if (!estudianteResponse.ok) {
          throw new Error('Error al obtener información del estudiante');
        }
        
        const estudiantesData = await estudianteResponse.json();
        const estudiante = (estudiantesData.estudiantes || []).find(est => est.usuario_id === userId);
        
        if (!estudiante) {
          console.error('No se encontró el estudiante con el ID de usuario:', userId);
          setCursos([]);
          return;
        }
        
        // Obtener los cursos del estudiante
        const cursosResponse = await fetch(`http://localhost:3000/api/estudiantes/${estudiante.id}/cursos`);
        if (!cursosResponse.ok) {
          throw new Error('Error al obtener cursos del estudiante');
        }
        
        const cursosData = await cursosResponse.json();
        setCursos(cursosData.cursos || []);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [userId]);

  if (loading) return <div>Cargando cursos...</div>;

  return (
    <div className="mis-cursos">
      <h2>Mis Cursos</h2>
      {cursos.length === 0 ? (
        <p>No estás inscrito en ningún curso.</p>
      ) : (
        <div className="cursos-lista">
          {cursos.map(curso => (
            <div key={curso.id} className="curso-card">
              <h3>{curso.nombre}</h3>
              <p>{curso.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCursos;