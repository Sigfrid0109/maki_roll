document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS cargado correctamente.");

  // Enlaces del menú
  const inicio = document.getElementById("inicio");
  const menu = document.getElementById("menu_pedidos");
  const ruleta = document.getElementById("ruleta");
  const logoutBtn = document.getElementById("logoutBtn");

  if (inicio) {
    inicio.addEventListener("click", () => {
      console.log("➡️ Clic en INICIO");
      window.location.href = "/vista/cliente";
    });
  } else {
    console.warn("⚠️ No se encontró el elemento con id='inicio'");
  }

  if (menu) {
    menu.addEventListener("click", () => {
      console.log("➡️ Clic en MENÚ");
      window.location.href = "/menu";
    });
  } else {
    console.warn("⚠️ No se encontró el elemento con id='menu_pedidos'");
  }

  if (ruleta) {
    ruleta.addEventListener("click", () => {
      console.log("➡️ Clic en RULETA");
      window.location.href = "/ruleta";
    });
  } else {
    console.warn("⚠️ No se encontró el elemento con id='ruleta'");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("🚪 Clic en LOGOUT");

      try {
        const response = await fetch("/logout", {
          method: "POST",
          credentials: "include" // 👈 importante para sesiones en Flask
        });

        if (response.ok) {
          console.log("✅ Sesión cerrada, redirigiendo al login...");
          window.location.href = "/";
        } else {
          alert("⚠️ Error al cerrar sesión.");
        }
      } catch (error) {
        console.error("❌ Error de conexión al cerrar sesión:", error);
        alert("Error de conexión con el servidor.");
      }
    });
  } else {
    console.warn("⚠️ No se encontró el botón de logout (id='logoutBtn')");
  }
});

