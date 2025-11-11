document.addEventListener("DOMContentLoaded", () => {

  // Enlaces del menú
  const inicio = document.getElementById("inicio");
  const menu = document.getElementById("menu_pedidos");
  const ruleta = document.getElementById("ruleta");

  if (inicio) {
    inicio.addEventListener("click", () => {
      window.location.href = "/vista/cliente";
    });
  }

  if (menu) {
    menu.addEventListener("click", () => {
      window.location.href = "/menu";
    });
  }

  if (ruleta) {
    ruleta.addEventListener("click", () => {
      window.location.href = "/ruleta";
    });
  }

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
