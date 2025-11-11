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




document.getElementById('logoutBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const response = await fetch('http://127.0.0.1:5000/logout', {
    method: 'POST',
    credentials: 'include' // 👈 importante para que Flask reconozca la sesión
  });

  if (response.ok) {
    window.location.href = '/login';
  } else {
    alert('Error al cerrar sesión.');
  }
});
