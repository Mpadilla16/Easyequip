document.addEventListener("DOMContentLoaded", () => {
  const cuerpoTabla = document.getElementById("cuerpoTabla");
  const inputBuscar = document.getElementById("inputBuscar");
  const formularioBusqueda = document.getElementById("formularioBusqueda");

  const mensajeError = document.createElement("div");
  mensajeError.className = "alert alert-warning mt-3 text-center d-none";
  mensajeError.setAttribute("role", "alert");

  if (inputBuscar && inputBuscar.parentNode) {
    inputBuscar.parentNode.parentNode.appendChild(mensajeError);
  }

  function mostrarMensaje(texto) {
    mensajeError.textContent = texto;
    mensajeError.classList.remove("d-none");
    setTimeout(() => mensajeError.classList.add("d-none"), 4000);
  }

  function obtenerSolicitudes() {
    fetch("https://localhost:44313/api/solicitud")
      .then(res => res.json())
      .then(data => {
        cuerpoTabla.innerHTML = "";
        data.forEach(solicitud => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td class="text-center">${solicitud.IdSolicitud}</td>
            <td class="text-center">${solicitud.FechaSolicitud.split("T")[0]}</td>
            <td class="text-center">${solicitud.Estado}</td>
            <td class="text-center">${solicitud.IdUsuario}</td>
            <td class="text-center">
              <button class="btn btn-success aprobar-btn" value="${solicitud.IdSolicitud}">Aprobar</button>
              <button class="btn btn-danger rechazar-btn" value="${solicitud.IdSolicitud}">Rechazar</button>
              <button class="btn btn-outline-secondary eliminar-btn" value="${solicitud.IdSolicitud}">Eliminar</button>
            </td>
          `;
          cuerpoTabla.appendChild(fila);
        });
      })
      .catch(error => {
        console.error("Error al obtener solicitudes:", error);
        mostrarMensaje("No se pudieron cargar las solicitudes.");
      });
  }

  cuerpoTabla.addEventListener("click", (e) => {
    const id = e.target.value;
    if (e.target.classList.contains("aprobar-btn")) {
      actualizarEstado(id, "Aprobada");
    } else if (e.target.classList.contains("rechazar-btn")) {
      actualizarEstado(id, "Rechazada");
    } else if (e.target.classList.contains("eliminar-btn")) {
      if (confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
        eliminarSolicitud(id);
      }
    }
  });

  function actualizarEstado(id, nuevoEstado) {
    fetch(`https://localhost:44313/api/solicitud/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("No se encontró la solicitud");
        return res.json();
      })
      .then(data => {
        const solicitud = Array.isArray(data) ? data[0] : data;

        const solicitudActualizada = {
          IdSolicitud: solicitud.IdSolicitud,
          FechaSolicitud: solicitud.FechaSolicitud,
          Estado: nuevoEstado,
          IdUsuario: solicitud.IdUsuario,
          IdEquipo: solicitud.IdEquipo,
          Cantidad: solicitud.Cantidad
        };

        return fetch(`https://localhost:44313/api/solicitud/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(solicitudActualizada)
        });
      })
      .then(res => {
        if (!res.ok) throw new Error("Error al actualizar la solicitud");
        return res.text();
      })
      .then(() => {
        mostrarMensaje(`Solicitud ${nuevoEstado.toLowerCase()} correctamente.`);
        obtenerSolicitudes();
      })
      .catch(err => {
        console.error(err);
        mostrarMensaje("No se pudo actualizar la solicitud.");
      });
  }

  function eliminarSolicitud(id) {
    fetch(`https://localhost:44313/api/solicitud/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar la solicitud");
        return res.text();
      })
      .then(() => {
        mostrarMensaje("Solicitud eliminada correctamente.");
        obtenerSolicitudes();
      })
      .catch(err => {
        console.error(err);
        mostrarMensaje("No se pudo eliminar la solicitud.");
      });
  }

  if (formularioBusqueda) {
    formularioBusqueda.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = inputBuscar.value.trim();

      if (id === "") {
        obtenerSolicitudes();
        return;
      }

      fetch(`https://localhost:44313/api/solicitud/${id}`)
        .then(res => {
          if (!res.ok) throw new Error("Solicitud no encontrada");
          return res.json();
        })
        .then(solicitudes => {
          const solicitud = Array.isArray(solicitudes) ? solicitudes[0] : solicitudes;
          if (!solicitud) throw new Error("No hay datos de solicitud");

          cuerpoTabla.innerHTML = `
            <tr>
              <td class="text-center">${solicitud.IdSolicitud}</td>
              <td class="text-center">${solicitud.FechaSolicitud.split("T")[0]}</td>
              <td class="text-center">${solicitud.Estado}</td>
              <td class="text-center">${solicitud.IdUsuario}</td>
              <td class="text-center">
                <button class="btn btn-success aprobar-btn" value="${solicitud.IdSolicitud}">Aprobar</button>
                <button class="btn btn-danger rechazar-btn" value="${solicitud.IdSolicitud}">Rechazar</button>
                <button class="btn btn-outline-secondary eliminar-btn" value="${solicitud.IdSolicitud}">Eliminar</button>
              </td>
            </tr>`;
        })
        .catch(err => {
          console.error("Error al buscar solicitud:", err);
          mostrarMensaje("No se encontró la solicitud con ese ID.");
        });
    });
  }

  if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
      if (inputBuscar.value.trim() === "") {
        obtenerSolicitudes();
      }
    });
  }

  obtenerSolicitudes();
});
