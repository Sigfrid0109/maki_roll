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


let premios = [];

async function cargar() {
  try {
    const res = await fetch("http://localhost:5000/api/premios");
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
    div.innerHTML = `
      <input value="${p.nombre}" data-index="${i}">
      <button onclick="eliminar(${i})">❌</button>`;
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
    await fetch("http://localhost:5000/api/premios", {
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
