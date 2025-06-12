document.addEventListener("DOMContentLoaded", () => {
  const cuerpoTabla = document.getElementById("cuerpoTabla");
  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");

  const mensajeError = document.createElement("div");
  mensajeError.className = "alert alert-warning mt-3 text-center d-none";
  mensajeError.setAttribute("role", "alert");
  inputBuscar.parentNode.parentNode.appendChild(mensajeError); // Inserta debajo del buscador

  function mostrarMensaje(texto) {
    mensajeError.textContent = texto;
    mensajeError.classList.remove("d-none");
    setTimeout(() => {
      mensajeError.classList.add("d-none");
    }, 4000);
  }

  function obtenerSolicitudes() {
    fetch("https://localhost:44313/api/solicitud")
      .then((response) => response.json())
      .then((data) => {
        cuerpoTabla.innerHTML = "";
        data.forEach((solicitud) => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td class="text-center">${solicitud.IdSolicitud}</td>
            <td class="text-center">${solicitud.FechaSolicitud.split("T")[0]}</td>
            <td class="text-center">${solicitud.Estado}</td>
            <td class="text-center">${solicitud.IdUsuario}</td>
            <td>
              <button class="btn btn-danger eliminar-btn" value="${solicitud.IdSolicitud}">Eliminar</button>
            </td>
          `;
          cuerpoTabla.appendChild(fila);
        });
      })
      .catch((error) => {
        console.error("Error al obtener solicitudes:", error);
        mostrarMensaje("No se pudieron cargar las solicitudes.");
      });
  }

  cuerpoTabla.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const id = e.target.value;
      if (confirm("¿Deseas eliminar esta solicitud?")) {
        console.log("ID a eliminar:", id);
        fetch(`https://localhost:44313/api/solicitud/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al eliminar la solicitud");
            return res.text(); // o res.json() si el backend devuelve un JSON
          })
          .then(() => {
            mostrarMensaje("Solicitud eliminada correctamente.");
            obtenerSolicitudes(); // 🔄 Recarga la tabla
          })
          .catch((err) => {
            console.error(err);
            mostrarMensaje("No se pudo eliminar la solicitud.");
          });
      }
    }
  });

  const formularioBusqueda = document.getElementById("formularioBusqueda");
  formularioBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = inputBuscar.value.trim();

    if (id === "") {
      obtenerSolicitudes();
      return;
    }

    fetch(`https://localhost:44313/api/solicitud/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Solicitud no encontrada");
        return res.json();
      })
      .then((solicitudes) => {
        if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
          throw new Error("No hay datos de solicitud");
        }

        const solicitud = solicitudes[0];

        cuerpoTabla.innerHTML = `
          <tr>
            <td class="text-center">${solicitud.IdSolicitud}</td>
            <td class="text-center">${solicitud.FechaSolicitud.split("T")[0]}</td>
            <td class="text-center">${solicitud.Estado}</td>
            <td class="text-center">${solicitud.IdUsuario}</td>
            <td>
              <button class="btn btn-danger eliminar-btn" value="${solicitud.IdSolicitud}">Eliminar</button>
            </td>
          </tr>`;
      })
      .catch((err) => {
        console.error("Error al buscar solicitud:", err);
        mostrarMensaje("No se encontró la solicitud con ese ID.");
      });
  });

  inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
      obtenerSolicitudes();
    }
  });

  // Carga inicial
  obtenerSolicitudes();
});
