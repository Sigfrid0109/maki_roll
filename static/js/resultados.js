document.addEventListener("DOMContentLoaded", () => {
  // Obtener rol guardado
  const rol = localStorage.getItem("rol");

  // ✅ Redirigir según el rol
  function irInicio() {
    if (rol === "administrador") {
      window.location.href = "/inicio_admin";
    } else if (rol === "editor") {
      window.location.href = "/inicio_editor";
    } else if (rol === "consultor") {
      window.location.href = "/inicio_consultor";
    } else {
      window.location.href = "/inicio_usuario"; // vista general
    }
  }

  // 🧭 Asignar eventos de navegación
  const inicio = document.getElementById("inicio");
  const ventas = document.getElementById("ventas");
  const menuEdt = document.getElementById("menuEdt");
  const pedidos = document.getElementById("pedidos");
  const ruletaPremios = document.getElementById("ruletaPremios");
  const ruletaConfig = document.getElementById("ruletaConfig");

  if (inicio) inicio.addEventListener("click", irInicio);

  if (ventas)
    ventas.addEventListener("click", () => {
      window.location.href = "/graficas_ventas";
    });

  if (menuEdt)
    menuEdt.addEventListener("click", () => {
      window.location.href = "/menu_admin";
    });

  if (pedidos)
    pedidos.addEventListener("click", () => {
      window.location.href = "/ver_pedidos";
    });

  if (ruletaPremios)
    ruletaPremios.addEventListener("click", () => {
      window.location.href = "/resultados";
    });

  if (ruletaConfig)
    ruletaConfig.addEventListener("click", () => {
      window.location.href = "/ruleta_config";
    });

  // 🍔 Menú hamburguesa
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("change", () => {
      menu.classList.toggle("activo", menuToggle.checked);
    });
  }
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
