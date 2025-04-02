document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();
  
      // Validar cada campo
      validarCampos();
  
      if (form.checkValidity()) {
        alert("Registro exitoso!");
        form.reset(); // Limpia el formulario
      }
    });
  
    function validarCampos() {
      validarNombre();
      validarIdentificacion();
      validarCorreo();
      validarTelefono();
      validarFechaNacimiento();
      validarPassword();
      validarConfirmPassword();
    }
  
    function validarNombre() {
      const nombre = document.getElementById("nombre");
      const regex = /^[A-Za-z\s]+$/;
      nombre.classList.toggle("is-invalid", !regex.test(nombre.value.trim()));
    }
  
    function validarIdentificacion() {
      const identificacion = document.getElementById("identificacion");
      const regex = /^[0-9]+$/;
      identificacion.classList.toggle("is-invalid", !regex.test(identificacion.value.trim()));
    }
  
    function validarCorreo() {
      const correo = document.getElementById("correo");
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      correo.classList.toggle("is-invalid", !regex.test(correo.value.trim()));
    }
  
    function validarTelefono() {
      const telefono = document.getElementById("telefono");
      const regex = /^[0-9]{10,}$/;
      telefono.classList.toggle("is-invalid", !regex.test(telefono.value.trim()));
    }
  
    function validarFechaNacimiento() {
      const fechaNacimiento = document.getElementById("fechaNacimiento");
      const fechaIngresada = new Date(fechaNacimiento.value);
      const fechaActual = new Date();
      fechaNacimiento.classList.toggle("is-invalid", fechaIngresada >= fechaActual);
    }
  
    function validarPassword() {
      const password = document.getElementById("password");
      const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      password.classList.toggle("is-invalid", !regex.test(password.value));
    }
  
    function validarConfirmPassword() {
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword");
      confirmPassword.classList.toggle("is-invalid", confirmPassword.value !== password);
    }
  });
  