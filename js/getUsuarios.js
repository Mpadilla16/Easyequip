document.addEventListener("DOMContentLoaded", () => {
  const cuerpoTabla = document.querySelector("table tbody");
  const inputBuscar = document.getElementById("inputBuscar");
  const formularioBusqueda = document.getElementById("formularioBusqueda");

  const mensajeError = document.createElement("div");
  mensajeError.className = "alert alert-warning mt-3 text-center d-none";
  mensajeError.setAttribute("role", "alert");
  inputBuscar?.parentNode?.parentNode?.appendChild(mensajeError);

  function mostrarMensaje(texto) {
    mensajeError.textContent = texto;
    mensajeError.classList.remove("d-none");
    setTimeout(() => mensajeError.classList.add("d-none"), 4000);
  }

  function cargarUsuarios() {
    fetch("https://localhost:44313/api/usuario")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los usuarios");
        return res.json();
      })
      .then((usuarios) => {
        cuerpoTabla.innerHTML = "";
        usuarios.forEach((usuario) => agregarFila(usuario));
      })
      .catch((error) => {
        console.error("Error:", error);
        mostrarMensaje("No se pudieron cargar los usuarios.");
      });
  }

  function agregarFila(usuario) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td class="text-center">${usuario.IdUsuario}</td>
      <td class="text-center">${usuario.Nombres}</td>
      <td class="text-center">${usuario.NumeroIdentificacion}</td>
      <td class="text-center">${usuario.Correo}</td>
      <td class="text-center">${usuario.Telefono || ""}</td>
      <td class="text-center">${usuario.FechaNacimiento ? usuario.FechaNacimiento.split("T")[0] : ""}</td>
      <td class="text-center">${usuario.IdRol}</td>
      <td class="text-center">
        <button class="btn btn-warning btn-sm editar-btn" value="${usuario.IdUsuario}">Editar</button>
        <button class="btn btn-danger btn-sm eliminar-btn" value="${usuario.IdUsuario}">Eliminar</button>
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  }

  // === Campos del formulario de edición ===
  const modalEditar = new bootstrap.Modal(document.getElementById("editarModal"));
  const formEditar = document.getElementById("formEditarUsuario");

  const camposEditar = {
    idUsuario: document.getElementById("editarUsuarioId"),
    nombres: document.getElementById("editarNombres"),
    numeroIdentificacion: document.getElementById("editarIdentificacion"),
    correo: document.getElementById("editarCorreo"),
    telefono: document.getElementById("editarTelefono"),
    fechaNacimiento: document.getElementById("editarFecha"),
    idRol: document.getElementById("editarRol"),
  };

  cuerpoTabla.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.value;

    if (target.classList.contains("eliminar-btn")) {
      if (confirm("¿Deseas eliminar este usuario?")) {
        fetch(`https://localhost:44313/api/usuario/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("No se pudo eliminar el usuario");
            mostrarMensaje("Usuario eliminado correctamente.");
            cargarUsuarios();
          })
          .catch((error) => {
            console.error("Error al eliminar:", error);
            mostrarMensaje("No se pudo eliminar el usuario.");
          });
      }
    }

    if (target.classList.contains("editar-btn")) {
      fetch(`https://localhost:44313/api/usuario/${id}`)
        .then((res) => res.json())
        .then((usuarioArray) => {
          const usuario = Array.isArray(usuarioArray) ? usuarioArray[0] : usuarioArray;
          console.log("Usuario recibido:", usuario);

          camposEditar.idUsuario.value = usuario.IdUsuario;
          camposEditar.nombres.value = usuario.Nombres;
          camposEditar.numeroIdentificacion.value = usuario.NumeroIdentificacion;
          camposEditar.correo.value = usuario.Correo;
          camposEditar.telefono.value = usuario.Telefono || "";
          camposEditar.fechaNacimiento.value = usuario.FechaNacimiento
            ? usuario.FechaNacimiento.split("T")[0]
            : "";
          camposEditar.idRol.value = usuario.IdRol;

          modalEditar.show();
        })
        .catch((error) => {
          console.error("Error cargando usuario para editar:", error);
          mostrarMensaje("No se pudo cargar el usuario para editar.");
        });
    }
  });

  formEditar.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuarioActualizado = {
      idUsuario: camposEditar.idUsuario.value,
      nombres: camposEditar.nombres.value,
      numeroIdentificacion: camposEditar.numeroIdentificacion.value,
      correo: camposEditar.correo.value,
      telefono: camposEditar.telefono.value,
      fechaNacimiento: camposEditar.fechaNacimiento.value,
      idRol: camposEditar.idRol.value,
    };

    fetch(`https://localhost:44313/api/usuario/${usuarioActualizado.idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioActualizado),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar");
        modalEditar.hide();
        mostrarMensaje("Usuario actualizado correctamente.");
        cargarUsuarios();
      })
      .catch((error) => {
        console.error("Error al actualizar usuario:", error);
        mostrarMensaje("No se pudo actualizar el usuario.");
      });
  });

  formularioBusqueda?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = inputBuscar.value.trim();
    if (id === "") {
      cargarUsuarios();
      return;
    }

    fetch(`https://localhost:44313/api/usuario/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Usuario no encontrado");
        return res.json();
      })
      .then((usuarios) => {
        if (!Array.isArray(usuarios) || usuarios.length === 0) {
          throw new Error("No hay datos");
        }
        cuerpoTabla.innerHTML = "";
        agregarFila(usuarios[0]);
      })
      .catch((error) => {
        console.error("Error al buscar usuario:", error);
        mostrarMensaje("No se encontró el usuario con ese ID.");
      });
  });

  inputBuscar?.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
      cargarUsuarios();
    }
  });

  cargarUsuarios(); // Carga inicial
});
