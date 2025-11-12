// === GESTIÓN DE ROLES ===
document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("rol");

  // Si no hay rol, redirigir al login
  if (!rol) {
    console.warn("No se encontró rol, redirigiendo al login...");
    window.location.href = "/";
    return;
  }

  console.log("Rol detectado:", rol);

  // === Mostrar opciones según el rol ===
  const btnVentas = document.getElementById("ventas");
  const btnMenu = document.getElementById("menuEdt");
  const btnPedidos = document.getElementById("pedidos");
  const btnRuletaPremios = document.getElementById("ruletaPremios");
  const btnRuletaConfig = document.getElementById("ruletaConfig");

  // Ocultar todo inicialmente
  [btnVentas, btnMenu, btnPedidos, btnRuletaPremios, btnRuletaConfig].forEach(btn => {
    if (btn) btn.style.display = "none";
  });

  // Mostrar según el rol
  switch (rol.toLowerCase()) {
    case "administrador":
      [btnVentas, btnMenu, btnPedidos, btnRuletaPremios, btnRuletaConfig].forEach(btn => {
        if (btn) btn.style.display = "block";
      });
      break;
    case "editor":
      [btnMenu, btnPedidos].forEach(btn => {
        if (btn) btn.style.display = "block";
      });
      break;
    case "consultor":
      [btnVentas, btnRuletaPremios].forEach(btn => {
        if (btn) btn.style.display = "block";
      });
      break;
  }

  // === Menú hamburguesa ===
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.querySelector(".menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("change", () => {
      menu.classList.toggle("activo", menuToggle.checked);
    });
  }

  // === Botón de inicio según rol ===
  const inicio = document.getElementById("inicio");
  if (inicio) {
    inicio.addEventListener("click", () => {
      if (rol === "administrador") window.location.href = "/inicio_admin";
      else if (rol === "editor") window.location.href = "/inicio_editor";
      else if (rol === "consultor") window.location.href = "/inicio_consultor";
      else window.location.href = "/inicio_usuario";
    });
  }
});
