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


let premios = [];

async function cargar() {
  try {
    const res = await fetch("/api/premios"); // ✅ ruta relativa
    premios = await res.json();
    render();
  } catch (error) {
    console.error("Error al cargar premios:", error);
  }
}

function render() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  premios.forEach((p, i) => {
    const div = document.createElement("div");
    div.classList.add("item-premio");
    div.innerHTML = `
      <input type="text" value="${p.nombre}" data-index="${i}">
      <button onclick="eliminar(${i})">❌</button>
    `;
    lista.appendChild(div);
  });
}

document.getElementById("agregar").onclick = () => {
  const val = document.getElementById("nuevo").value.trim();
  if (val) premios.push({ nombre: val });
  document.getElementById("nuevo").value = "";
  render();
};

window.eliminar = (i) => {
  premios.splice(i, 1);
  render();
};

document.getElementById("guardar").onclick = async () => {
  try {
    await fetch("/api/premios", { // ✅ ruta relativa
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premios: premios.map(p => p.nombre) })
    });
    alert("Premios actualizados ✅");
  } catch (error) {
    alert("Error al guardar los premios ❌");
    console.error(error);
  }
};

cargar();

