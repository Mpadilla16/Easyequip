document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.getElementById("cuerpoTabla");
  const formRegistrar = document.getElementById("formRegistrar");
  const formEditar = document.getElementById("formEditar");
  const btnConsultar = document.getElementById("btnConsultar");
  const btnRegistrar = document.getElementById("btnRegistrar");

  const API_URL = "https://localhost:44313/api/Equipo";

  // ========================
  // 1. FUNCIONES PRINCIPALES
  // ========================

  function obtenerEquipos() {
    fetch(API_URL)
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
              <button class="btn btn-warning btn-sm" onclick="editarEquipo(${equipo.IdEquipo})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarEquipo(${equipo.IdEquipo})">Eliminar</button>
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

  // ====================
  // 2. REGISTRAR EQUIPO
  // ====================
  if (formRegistrar) {
    formRegistrar.addEventListener("submit", function (event) {
      event.preventDefault();

      const nuevoEquipo = {
        Nombre: document.getElementById("nombre").value,
        Descripcion: document.getElementById("descripcion").value,
        CantidadDisponible: parseInt(document.getElementById("cantidadDisponible").value)
      };

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEquipo)
      })
        .then(response => {
          if (!response.ok) throw new Error("No se pudo registrar el equipo");
          alert("✅ Equipo registrado correctamente");
          window.location.href = "equipoAdministrador.html";
        })
        .catch(error => {
          alert("❌ Error al registrar el equipo: " + error.message);
        });
    });
  }

  // ====================
  // 3. ELIMINAR EQUIPO
  // ====================
  window.eliminarEquipo = function (id) {
    if (confirm("¿Seguro que deseas eliminar este equipo?")) {
      fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      })
        .then(response => {
          if (!response.ok) throw new Error("Error al eliminar el equipo");
          alert("✅ Equipo eliminado correctamente.");
          obtenerEquipos();
        })
        .catch(error => {
          console.error("❌ Error al eliminar equipo:", error);
          alert("Error al eliminar el equipo. Verifica que la API esté funcionando.");
        });
    }
  };

  // ====================
  // 4. REDIRIGIR A EDITAR
  // ====================
  window.editarEquipo = function (id) {
    window.location.href = `editarEquipo.html?id=${id}`;
  };

  // ==========================
  // 5. FORMULARIO DE EDICIÓN
  // ==========================
  if (formEditar) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
      alert("ID de equipo no especificado.");
      window.location.href = "equipoAdministrador.html";
      return;
    }

    fetch(`${API_URL}/${id}`)
      .then(response => {
        if (!response.ok) throw new Error("Equipo no encontrado");
        return response.json();
      })
      .then(equipoArray => {
        const equipo = equipoArray[0]; // <== Solución importante
        if (!equipo) throw new Error("Equipo vacío o no encontrado");

        document.getElementById("nombre").value = equipo.Nombre;
        document.getElementById("descripcion").value = equipo.Descripcion;
        document.getElementById("cantidadDisponible").value = equipo.CantidadDisponible;
      })
      .catch(error => {
        alert("❌ Error al cargar equipo: " + error.message);
        window.location.href = "equipoAdministrador.html";
      });

    formEditar.addEventListener("submit", (event) => {
      event.preventDefault();

      const equipoActualizado = {
        IdEquipo: parseInt(id),
        Nombre: document.getElementById("nombre").value,
        Descripcion: document.getElementById("descripcion").value,
        CantidadDisponible: parseInt(document.getElementById("cantidadDisponible").value)
      };

      fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(equipoActualizado)
      })
        .then(response => {
          if (!response.ok) throw new Error("Error al actualizar equipo");
          alert("✅ Equipo actualizado correctamente");
          window.location.href = "equipoAdministrador.html";
        })
        .catch(error => alert("❌ Error: " + error.message));
    });
  }

  // ====================
  // 6. BOTONES DE REDIRECCIÓN
  // ====================
  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () => {
      window.location.href = "registrarEquipo.html";
    });
  }

  if (btnConsultar) {
    btnConsultar.addEventListener("click", () => {
      window.location.href = "consultarEquipo.html";
    });
  }

  // ====================
  // 7. INICIALIZAR TABLA
  // ====================
  if (tabla) {
    obtenerEquipos();
  }
});
