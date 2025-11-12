document.addEventListener("DOMContentLoaded", () => {
  // 🟢 Obtener rol guardado en localStorage
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
      window.location.href = "/inicio_usuario";
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
