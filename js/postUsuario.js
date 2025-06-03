document.addEventListener("DOMContentLoaded", () => {
  const registrar = document.getElementById("registrar");

  registrar.addEventListener("click", (e) => {
    e.preventDefault();

    // Captura de campos
    const nombre = document.getElementById("nombre").value;
    const identificacion = document.getElementById("identificacion").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const rol = parseInt(document.getElementById("rol").value);
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terminos = document.getElementById("terminos");

    // Validaciones
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!terminos.checked) {
      alert("Debe aceptar los términos y condiciones.");
      return;
    }

    // Objeto con nombres exactamente como los espera el backend
    const data = {
      Nombres: nombre,
      NumeroIdentificacion: identificacion,
      Correo: correo,
      Telefono: telefono,
      FechaNacimiento: fechaNacimiento,
      Contrasena: password,
      ConfirmarContrasena: confirmPassword,
      IdRol: rol
    };

    // Mostrar los datos que se enviarán
    console.log("Datos enviados al backend:", JSON.stringify(data, null, 2));

    fetch("https://localhost:44313/api/Usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json(); // Leer el valor booleano que devuelve el backend
      })
      .then((result) => {
        console.log("Respuesta del backend:", result);
        if (result === true) {
          alert("Usuario registrado correctamente");
          window.location.href = "src/index.html"; // Ajusta si tu estructura de carpetas es diferente
        } else {
          alert("El servidor respondió, pero no se registró el usuario.");
        }
      })
      .catch((error) => {
        console.error("Error de conexión con el servidor:", error);
        alert("Error de conexión. Verifica si el backend está corriendo.");
      });
  });
});

