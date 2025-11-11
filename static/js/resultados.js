document.addEventListener("DOMContentLoaded", () => {
  // Obtener rol guardado
  const rol = localStorage.getItem("rol");

  // ✅ Detectar inicio según el rol
  function irInicio() {
    if (rol === "administrador") {
      window.location.href = "/inicio_admin.html";
    } else if (rol === "editor") {
      window.location.href = "/inicio_editor.html";
    } else if (rol === "consultor") {
      window.location.href = "/inicio_consultor.html";
    } else {
      window.location.href = "/inicio_usuario.html"; // o la vista general
    }
  }

  // 🧭 Asignar eventos
  document.getElementById("inicio").addEventListener("click", irInicio);

  document.getElementById("ventas").addEventListener("click", () => {
    window.location.href = "/Graficas_de_venta_adm_consu_edt/Estadisticas/index.html";
  });

  document.getElementById("menuEdt").addEventListener("click", () => {
    window.location.href = "/Menu/templates/menu_admin.html";
  });

  document.getElementById("pedidos").addEventListener("click", () => {
    window.location.href = "/Pedidos_adm_consu_edt/ver_pedidos.html";
  });

  document.getElementById("ruletaPremios").addEventListener("click", () => {
    window.location.href = "/Ruleta_vista_general/resultados.html";
  });

  document.getElementById("ruletaConfig").addEventListener("click", () => {
    window.location.href = "/Ruleta_vista_general/ruleta_config.html";
  });
});

async function cargarResultados() {
  try {
    const res = await fetch("http://localhost:5000/api/resultados");
    const datos = await res.json();
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    if (datos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="4">No hay giros registrados aún.</td></tr>`;
      return;
    }

    datos.forEach(r => {
      const fila = `
        <tr>
          <td>${r.id_resultado}</td>
          <td>${r.usuario || "Invitado"}</td>
          <td>${r.premio}</td>
          <td>${new Date(r.fecha).toLocaleString()}</td>
        </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (err) {
    console.error("Error cargando resultados:", err);
    document.getElementById("tabla").innerHTML =
      `<tr><td colspan="4">Error al cargar los datos.</td></tr>`;
  }
}

cargarResultados();
