document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------
  // 🔹 MENÚ HAMBURGUESA
  // -----------------------------------
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.querySelector(".menu");
  const menuBtn = document.querySelector(".menu-btn");

  if (menuBtn && menuToggle && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("open"); // Abre/cierra el menú
    });
  }

  // Cierra el menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove("open");
    }
  });

  // -----------------------------------
  // 🔹 REDIRECCIONES SEGÚN ROL
  // -----------------------------------
  const rol = localStorage.getItem("rol");

  function irInicio() {
    if (rol === "administrador") {
      window.location.href = "/admin";
    } else if (rol === "editor") {
      window.location.href = "/editor";
    } else if (rol === "consultor") {
      window.location.href = "/consultor";
    } else {
      window.location.href = "/cliente.html";
    }
  }

  // -----------------------------------
  // 🔹 EVENTOS DEL MENÚ
  // -----------------------------------
  const enlaces = {
    inicio: irInicio,
    ventas: () => (window.location.href = "/graficas_ventas"),
    menuEdt: () => (window.location.href = "/menu_admin"),
    pedidos: () => (window.location.href = "/ver_pedidos"),
    ruletaPremios: () => (window.location.href = "/resultados"),
    ruletaConfig: () => (window.location.href = "/ruleta_config"),
  };

  Object.keys(enlaces).forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener("click", () => {
        enlaces[id]();
        menu.classList.remove("open"); // ✅ cierra menú tras click
      });
    }
  });
});

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
