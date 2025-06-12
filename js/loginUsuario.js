document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Aprendiz", "Instructor", "Admin"];

  roles.forEach((rol) => {
    const boton = document.getElementById(`iniciarSesion${rol}`);
    const correoInput = document.getElementById(`email${rol}`);
    const passwordInput = document.getElementById(`password${rol}`);

    if (boton && correoInput && passwordInput) {
      boton.addEventListener("click", (e) => {
        e.preventDefault();

        const correo = correoInput.value;
        const contrasena = passwordInput.value;

        if (!correo || !contrasena) {
          alert("Por favor, completa todos los campos.");
          return;
        }

        const loginData = {
          Correo: correo,
          Contrasena: contrasena
        };

        console.log("Datos enviados:", loginData);

        fetch("https://localhost:44313/api/Usuario/Login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginData)
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error de credenciales o del servidor.");
            }
            return response.json();
          })
          .then((result) => {
            console.log("Respuesta del login:", result);

            // Validamos si hay un IdUsuario como indicador de inicio de sesión exitoso
            if (result && result.IdUsuario) {
              alert("Inicio de sesión exitoso");

              localStorage.setItem("usuario", JSON.stringify(result));

              // Redirección específica por rol
              let urlDestino = "";
              switch (rol) {
                case "Aprendiz":
                  urlDestino = "/src/InicioUsuario.html";
                  break;
                case "Instructor":
                  urlDestino = "/src/InicioUsuario.html";
                  break;
                case "Admin":
                  urlDestino = "gestionUsuarioAdministrador.html";
                  break;
              }

              window.location.href = urlDestino;
            } else {
              alert("Correo o contraseña incorrectos.");
            }
          })
          .catch((error) => {
            console.error("Error al iniciar sesión:", error);
            alert("Error al conectarse con el servidor.");
          });
      });
    }
  });
});
