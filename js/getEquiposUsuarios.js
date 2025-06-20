// getEquiposUsuarios.js
document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.getElementById("cuerpoTabla");
  const btnConsultar = document.getElementById("btnConsultar");

  function obtenerEquipos() {
    fetch("https://localhost:44313/api/Equipo")
      .then(response => {
        if (!response.ok) throw new Error("Error al obtener los datos");
        return response.json();
      })
      .then(data => {
        if (!tabla) return;
        tabla.innerHTML = "";

        data.forEach(equipo => {
          const fila = document.createElement("tr");
          fila.id = `equipo-${equipo.IdEquipo}`;
          fila.innerHTML = `
            <td>${equipo.IdEquipo}</td>
            <td>${equipo.Nombre}</td>
            <td>${equipo.Descripcion}</td>
            <td>${equipo.CantidadDisponible}</td>
            <td class="d-flex justify-content-center gap-2">
              <button class="btn btn-primary btn-sm" onclick="solicitarEquipo(${equipo.IdEquipo}, ${equipo.CantidadDisponible})">Solicitar</button>
            </td>
          `;
          tabla.appendChild(fila);
        });
      })
      .catch(error => {
        console.error("❌ Error al obtener datos de la API:", error);
        if (tabla) {
          tabla.innerHTML = `
            <tr>
              <td colspan="5" class="text-center text-danger">Error al cargar los datos.</td>
            </tr>
          `;
        }
      });
  }

  window.solicitarEquipo = function (idEquipo, cantidadDisponible) {
    const cantidad = parseInt(prompt("¿Cuántas unidades deseas solicitar?", "1"));

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("❌ Debes ingresar una cantidad válida.");
      return;
    }

    if (cantidad > cantidadDisponible) {
      alert("❌ La cantidad solicitada supera la cantidad disponible.");
      return;
    }

    const solicitud = {
      FechaSolicitud: new Date().toISOString().split("T")[0],
      Estado: "Pendiente",
      IdUsuario: 1, // ⚠️ Reemplaza con el ID real del usuario autenticado
      IdEquipo: idEquipo,
      Cantidad: cantidad
    };

    fetch("https://localhost:44313/api/Solicitud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud)
    })
      .then(response => {
        if (!response.ok) throw new Error("No se pudo registrar la solicitud");
        alert("✅ Solicitud enviada correctamente.");
      })
      .catch(error => {
        console.error("❌ Error al registrar la solicitud:", error);
        alert("Error al registrar la solicitud.");
      });
  };

  if (btnConsultar) {
    btnConsultar.addEventListener("click", () => {
      window.location.href = "consultarEquipoUsua.html";
    });
  }

  if (tabla) {
    obtenerEquipos();
  }
});
