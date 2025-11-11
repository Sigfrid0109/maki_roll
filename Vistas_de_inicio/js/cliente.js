// Esperar a que todo el contenido del documento esté cargado
document.addEventListener("DOMContentLoaded", () => {
  // Asignar eventos a los enlaces del menú
  document.getElementById("inicio").addEventListener("click", () => {
    window.location.href = "Vistas_de_inicio/cliente.html";
  });

  document.getElementById("menu y pedidos").addEventListener("click", () => {
    window.location.href = "Menu/templates/menu.html";
  });

  document.getElementById("ruleta").addEventListener("click", () => {
    window.location.href = "Ruleta_vista_general/ruleta.html";
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
