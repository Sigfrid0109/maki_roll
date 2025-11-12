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

let platilloSeleccionado = ""; // Variable global

// Detectar clic en cualquier botón "Comprar"
document.querySelectorAll(".btn-comprar").forEach(boton => {
  boton.addEventListener("click", () => {
    platilloSeleccionado = boton.getAttribute("data-producto");
    document.getElementById("platillo").value = platilloSeleccionado;
    document.getElementById("formularioPedido").showModal();
  });
});

// Botón "Cancelar" del formulario
document.getElementById("cancelarPedido").addEventListener("click", () => {
  document.getElementById("formularioPedido").close();
});

// Enviar pedido al backend Flask
document.getElementById("formPedido").addEventListener("submit", async function(event) {
  event.preventDefault();

  const datos = {
    platillo: document.getElementById("platillo").value,
    nombre: document.getElementById("nombre").value,
    usuario: document.getElementById("usuario").value,
    direccion: document.getElementById("direccion").value,
    telefono: document.getElementById("telefono").value,
    codigo_postal: document.getElementById("codigo-postal").value,
    tipo_vivienda: document.getElementById("tipo-vivienda").value,
    referencia: document.getElementById("referencia").value,
    comentarios: document.getElementById("comentarios").value
  };

  try {
    const respuesta = await fetch("http://127.0.0.1:5000/enviar_pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();
    alert(resultado.mensaje);

    document.getElementById("formPedido").reset();
    document.getElementById("formularioPedido").close();

  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert("Hubo un error al enviar tu pedido. Inténtalo nuevamente.");
  }
});
