// Esperar a que todo el contenido del documento esté cargado
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
  // Asignar eventos a los enlaces del menú
  document.getElementById("inicio").addEventListener("click", () => {
    window.location.href = "";
  });

  document.getElementById("Venta").addEventListener("click", () => {
    window.location.href = "Graficas_de_venta_adm_consu_edt/Estadisticas/index.HTML";
  });

  document.getElementById("Menu").addEventListener("click", () => {
    window.location.href = "Menu/templates/menu_admin.html";
  });

  document.getElementById("Pedidos").addEventListener("click", () => {
    window.location.href = "Pedidos_adm_consu_edt/ver_pedidos.html";
  });

  document.getElementById("Ruleta premios").addEventListener("click", () => {
    window.location.href = "/Ruleta_vista_general/resultados.html";
  });

  document.getElementById("Ruleta config").addEventListener("click", () => {
    window.location.href = "Ruleta_vista_general/ruleta_config.html";
  });
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
