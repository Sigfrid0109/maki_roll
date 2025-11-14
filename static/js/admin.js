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

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tablaPlatillos');
    const modal = document.getElementById('modalPlatillo');
    const form = document.getElementById('formPlatillo');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnCancelar = document.getElementById('btnCancelar');
    const tituloModal = document.getElementById('tituloModal');

    let modoEditar = false;
    let idActual = null;

    // ===== CARGAR PLATILLOS =====
    const cargarPlatillos = async () => {
        try {
            const res = await fetch('/api/platillos');
            const platillos = await res.json();
            tabla.innerHTML = '';
            platillos.forEach(p => {
                tabla.innerHTML += `
    <tr>
        <td>${p.id_item}</td>
        <td><img src="/static/img/${p.imagen}" width="80" alt="${p.nombre}"></td>
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>$${p.precio}</td>
        <td>${p.categoria}</td>
        <td>${p.activo ? '✅' : '❌'}</td>
        <td>
            <button onclick="editar(${p.id_item})">✏️</button>
            <button onclick="eliminar(${p.id_item})">🗑️</button>
        </td>
    </tr>
`;
            });
        } catch (error) {
            console.error('Error al cargar platillos:', error);
        }
    };

    // ===== ABRIR MODAL PARA AGREGAR =====
    btnAgregar.addEventListener('click', () => {
        modoEditar = false;
        idActual = null;
        form.reset();
        tituloModal.textContent = 'Agregar Platillo';
        if (modal.showModal) {
            modal.showModal();
        } else {
            modal.style.display = 'block';
        }
    });

    // ===== CERRAR MODAL =====
    btnCancelar.addEventListener('click', () => {
        if (modal.close) {
            modal.close();
        } else {
            modal.style.display = 'none';
        }
    });

    // ===== GUARDAR (AGREGAR O EDITAR) =====
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nombre: form.nombre.value,
            descripcion: form.descripcion.value,
            precio: parseFloat(form.precio.value),
            categoria: form.categoria.value,
            imagen: form.imagen.value,
            activo: form.activo.checked
        };

        try {
            if (modoEditar && idActual) {
                // Actualizar platillo existente
                await fetch(`/api/platillos/${idActual}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // Agregar nuevo platillo
                await fetch('/api/platillos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (modal.close) {
                modal.close();
            } else {
                modal.style.display = 'none';
            }

            cargarPlatillos();
        } catch (error) {
            console.error('Error al guardar platillo:', error);
        }
    });

    // ===== EDITAR PLATILLO =====
    window.editar = async (id) => {
        try {
            id = Number(id);
            console.log("Editando platillo con ID:", id);

            const res = await fetch('/api/platillos');
            const platillos = await res.json();
            const p = platillos.find(x => Number(x.id_item) === id);


            if (!p) {
                alert("Platillo no encontrado.");
                return;
            }

            modoEditar = true;
            idActual = id;

            tituloModal.textContent = 'Editar Platillo';
            form.nombre.value = p.nombre || '';
            form.descripcion.value = p.descripcion || '';
            form.precio.value = p.precio || '';
            form.categoria.value = p.categoria || '';
            form.imagen.value = p.imagen || '';
            form.activo.checked = p.activo;

            if (modal.showModal) {
                modal.showModal();
            } else {
                modal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al editar platillo:', error);
        }
    };

    // ===== ELIMINAR PLATILLO =====
    window.eliminar = async (id) => {
        if (confirm('¿Eliminar este platillo?')) {
            try {
                await fetch(`/api/platillos/${id}`, { method: 'DELETE' });
                cargarPlatillos();
            } catch (error) {
                console.error('Error al eliminar platillo:', error);
            }
        }
    };

    // ===== INICIAR =====
    cargarPlatillos();
});

