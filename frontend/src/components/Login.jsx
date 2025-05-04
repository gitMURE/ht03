import React, { useState } from "react";
import Swal from "sweetalert2";
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const usuario = { nombre_usuario: nombreUsuario, contrasena };

    try {
      console.log("Enviando datos:", usuario);

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();
      
      if (response.ok) {
        Swal.fire("Éxito", data.mensaje, "success");
        console.log("Datos del usuario:", data.usuario);
        // Llamar a la función onLoginSuccess con los datos del usuario
        onLoginSuccess && onLoginSuccess(data.usuario);
      } else {
        Swal.fire("Error", data.mensaje || "Error de autenticación", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Problema de conexión con el servidor", "error");
      console.error("Error en la solicitud:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombreUsuario">Usuario</label>
            <input
              type="text"
              id="nombreUsuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Iniciar sesión"}
          </button>
        </form>
        
        <div className="login-links">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;