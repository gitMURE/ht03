import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const LogoutComponent = ({ setUser }) => {
  useEffect(() => {
    // Limpiar el usuario al montar el componente
    setUser(null);
  }, [setUser]);

  // Redirigir a la página de inicio
  return <Navigate to="/" replace />;
};

export default LogoutComponent;