import React, { useState } from "react";
import Swal from "sweetalert2";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const usuario = { nombre_usuario: nombreUsuario, contrasena };

    try {
      // Mostrar en consola lo que se envía para depuración
      console.log("Enviando datos:", usuario);

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      // Verificar que la respuesta es válida y es JSON
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire("Éxito", data.mensaje, "success");
        // Aquí podrías guardar el token o la información del usuario en localStorage
        // y redirigir al usuario a la página principal
        console.log("Datos del usuario:", data.usuario);
      } else {
        Swal.fire("Error", data.mensaje || "Error de autenticación", "error");
      }
    } catch (error) {
      // En caso de que haya un error en la solicitud
      Swal.fire("Error", "Problema de conexión con el servidor", "error");
      console.error("Error en la solicitud:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombreUsuario">Usuario</label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;