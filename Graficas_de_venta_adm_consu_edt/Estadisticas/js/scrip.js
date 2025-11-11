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




document.addEventListener('DOMContentLoaded', () => {
  // inicializamos categorías con valores entre 500 y 900
  const categorias = [
    { key: 'Entradas', valor: randomBetween(500, 900), max: 1000 },
    { key: 'Bebidas',  valor: randomBetween(500, 900), max: 1000 },
    { key: 'Ramen',    valor: randomBetween(500, 900), max: 1000 },
    { key: 'Arroz',    valor: randomBetween(500, 900), max: 1000 },
    { key: 'Sushi',    valor: randomBetween(500, 900), max: 1000 },
    { key: 'Postres',  valor: randomBetween(500, 900), max: 1000 }
  ];

  // totales iniciales (sensible)
  let totalPedidos = 500;
  let totalVentas  = 18700;

  // función auxiliar
  function randomBetween(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

  // actualiza una categoría en DOM (barra + texto)
  function actualizarCategoria(cat){
    const barraEl = document.getElementById('barra' + cat.key);
    const textoEl = document.getElementById('texto' + cat.key);
    if(!barraEl || !textoEl) return; // seguridad

    const pct = Math.max(0, Math.min(100, (cat.valor / cat.max) * 100));
    barraEl.style.width = pct.toFixed(2) + '%';
    textoEl.textContent = `${cat.valor} de ${cat.max}`;
  }

  // actualizar todas al inicio
  categorias.forEach(actualizarCategoria);

  // actualizar totales en DOM
  function actualizarTotalesDOM(){
    const tp = document.getElementById('totalPedidos');
    const tv = document.getElementById('totalVentas');
    if(tp) tp.textContent = totalPedidos.toLocaleString();
    if(tv) tv.textContent = `$${totalVentas.toLocaleString()}`;
  }
  actualizarTotalesDOM();

  // Simulación periódica: aumenta totales y pequeñas variaciones por categoría
  setInterval(() => {
    // aumentar pedidos y ventas
    totalPedidos += randomBetween(2, 10);
    totalVentas  += randomBetween(150, 700);

    // pequeñas variaciones por categoría (suben o bajan ligeramente pero se mantienen >=500)
    categorias.forEach(cat => {
      const delta = randomBetween(-8, 12); // puede bajar un poco o subir
      cat.valor = Math.min(cat.max, Math.max(500, cat.valor + delta));
      actualizarCategoria(cat);
    });

    actualizarTotalesDOM();
  }, 5000); // cada 5s
});
