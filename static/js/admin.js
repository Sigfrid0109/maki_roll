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

    const cargarPlatillos = async () => {
        const res = await fetch('/api/platillos');
        const platillos = await res.json();
        tabla.innerHTML = '';
        platillos.forEach(p => {
            tabla.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td><img src="${p.imagen}" width="80"></td>
                    <td>${p.nombre}</td>
                    <td>${p.descripcion}</td>
                    <td>$${p.precio}</td>
                    <td>${p.categoria}</td>
                    <td>${p.activo ? '✅' : '❌'}</td>
                    <td>
                        <button onclick="editar(${p.id})">✏️</button>
                        <button onclick="eliminar(${p.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    };

    btnAgregar.addEventListener('click', () => {
        modoEditar = false;
        form.reset();
        tituloModal.textContent = 'Agregar Platillo';
        modal.showModal();
    });

    btnCancelar.addEventListener('click', () => modal.close());

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

        if (modoEditar) {
            await fetch(`/api/platillos/${idActual}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            await fetch('/api/platillos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        modal.close();
        cargarPlatillos();
    });

    window.editar = async (id) => {
        const res = await fetch('/api/platillos');
        const platillos = await res.json();
        const p = platillos.find(x => x.id === id);
        if (!p) return;
        modoEditar = true;
        idActual = id;
        tituloModal.textContent = 'Editar Platillo';
        form.nombre.value = p.nombre;
        form.descripcion.value = p.descripcion;
        form.precio.value = p.precio;
        form.categoria.value = p.categoria;
        form.imagen.value = p.imagen;
        form.activo.checked = p.activo;
        modal.showModal();
    };

    window.eliminar = async (id) => {
        if (confirm('¿Eliminar este platillo?')) {
            await fetch(`/api/platillos/${id}`, { method: 'DELETE' });
            cargarPlatillos();
        }
    };

    cargarPlatillos();
});
