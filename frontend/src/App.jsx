import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Layout/Dashboard';
import MisCursos from './components/Estudiante/MisCursos';
import RegistrarEstudiante from './components/Docente/RegistrarEstudiante';
import RegistrarCurso from './components/Docente/RegistrarCurso';
import InscribirEstudiante from './components/Docente/InscribirEstudiante';
import ListaEstudiantes from './components/Docente/ListaEstudiantes';
import ListaCursos from './components/Docente/ListaCursos';
import LogoutComponent from './components/LogoutComponent';

const App = () => {
  // Simulamos un estado de autenticación (en un proyecto real esto vendría de un contexto o estado global)
  const [user, setUser] = useState(null);

  // Función para manejar el login exitoso
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Componente de protección de rutas
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLogin} />
        } />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        >
          {/* Rutas para estudiantes */}
          <Route 
            path="mis-cursos" 
            element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                <MisCursos userId={user?.id} />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas para docentes */}
          <Route 
            path="registrar-estudiante" 
            element={
              <ProtectedRoute allowedRoles={['docente']}>
                <RegistrarEstudiante />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="registrar-curso" 
            element={
              <ProtectedRoute allowedRoles={['docente']}>
                <RegistrarCurso docenteId={user?.id} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="inscribir-estudiante" 
            element={
              <ProtectedRoute allowedRoles={['docente']}>
                <InscribirEstudiante />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="lista-estudiantes" 
            element={
              <ProtectedRoute allowedRoles={['docente']}>
                <ListaEstudiantes />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="lista-cursos" 
            element={
              <ProtectedRoute allowedRoles={['docente']}>
                <ListaCursos />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Ruta para logout */}
        <Route 
          path="/logout" 
          element={
            <LogoutComponent setUser={setUser} />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;