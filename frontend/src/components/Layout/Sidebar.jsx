import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({ userRole }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3> Blackboard 2</h3>
      </div>
      <div className="sidebar-menu">
        {userRole === 'estudiante' && (
          <>
            <Link to="/dashboard" className="sidebar-item">Dashboard</Link>
            <Link to="/dashboard/mis-cursos" className="sidebar-item">Mis Cursos</Link>
          </>
        )}
        
        {userRole === 'docente' && (
          <>
            <Link to="/dashboard" className="sidebar-item">Dashboard</Link>
            <Link to="/dashboard/registrar-estudiante" className="sidebar-item">Registrar Estudiante</Link>
            <Link to="/dashboard/registrar-curso" className="sidebar-item">Registrar Curso</Link>
            <Link to="/dashboard/inscribir-estudiante" className="sidebar-item">Inscribir Estudiante</Link>
            <Link to="/dashboard/lista-estudiantes" className="sidebar-item">Lista de Estudiantes</Link>
            <Link to="/dashboard/lista-cursos" className="sidebar-item">Lista de Cursos</Link>
          </>
        )}
        
        <Link to="/logout" className="sidebar-item logout">Cerrar Sesión</Link>
      </div>
    </div>
  );
};

export default Sidebar;