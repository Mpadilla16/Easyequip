document.addEventListener("DOMContentLoaded", () => {
  const cuerpoTabla = document.getElementById("cuerpoTablaDetalles");

  function obtenerSolicitudes() {
    fetch("https://localhost:44313/api/DetalleSolicitud")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        cuerpoTabla.innerHTML = "";
        data.forEach((solicitud) => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td class="text-center">${solicitud.IdDetalleSolicitud}</td>
            <td class="text-center">${solicitud.IdEquipo}</td>
            <td class="text-center">${solicitud.Cantidad}</td>
            <td>
              <button class="btn btn-danger eliminar-btn" value="${solicitud.id}">Eliminar</button>
            </td>
          `;
          cuerpoTabla.appendChild(fila);
        });
      })
      .catch((error) => console.error("Error al obtener solicitudes:", error));
  }

  cuerpoTabla.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const id = e.target.value;
      if (confirm("¿Deseas eliminar esta solicitud?")) {
        fetch(`https://localhost:44313/api/DetalleSolicitud/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al eliminar la solicitud");
            e.target.closest("tr").remove();
          })
          .catch((err) => console.error(err));
      }
    } else if (e.target.classList.contains("editar-btn")) {
      const id = e.target.value;
      window.location.href = `../view/editarSolicitud.html?id=${id}`;
    }
  });

  obtenerSolicitudes();
});
