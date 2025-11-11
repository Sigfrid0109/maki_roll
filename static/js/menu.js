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

  if (menu_pedidos) {
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

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const carritoIcono = document.getElementById('carritoIcono');
    const carritoContador = document.getElementById('carritoContador');
    const listaCarrito = document.getElementById('lista-carrito');
    const carritoVacio = document.getElementById('carritoVacio');
    const totalElement = document.getElementById('total');
    const btnRealizarPedido = document.getElementById('realizar-pedido');
    const formularioPedido = document.getElementById('formularioPedido');
    const formPedido = document.getElementById('formPedido');
    const btnCancelarPedido = document.getElementById('cancelarPedido');
    const botonesCategoria = document.querySelectorAll('.btn-menu');
    const platillos = document.querySelectorAll('.platillo');
    const btnsComprar = document.querySelectorAll('.btn-comprar');

    // Variables globales
    let carrito = [];

    // Filtrado de platillos
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            botonesCategoria.forEach(btn => btn.classList.remove('activo'));
            // Agregar clase activa al botón clickeado
            boton.classList.add('activo');
            
            const categoria = boton.getAttribute('data-categoria');
            filtrarPlatillos(categoria);
        });
    });

    function filtrarPlatillos(categoria) {
        platillos.forEach(platillo => {
            if (categoria === 'todos' || platillo.getAttribute('data-platillo') === categoria) {
                platillo.style.display = 'block';
            } else {
                platillo.style.display = 'none';
            }
        });
    }

    // Funcionalidad del carrito
    btnsComprar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const producto = btn.getAttribute('data-producto');
            const precio = parseInt(btn.getAttribute('data-precio'));
            agregarAlCarrito(producto, precio);
        });
    });

    function agregarAlCarrito(producto, precio) {
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.producto === producto);
        
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ 
                producto, 
                precio, 
                cantidad: 1 
            });
        }
        
        actualizarCarrito();
        mostrarNotificacion(`${producto} agregado al carrito`);
    }

    function eliminarDelCarrito(index) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    function actualizarCantidad(index, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(index);
        } else {
            carrito[index].cantidad = nuevaCantidad;
            actualizarCarrito();
        }
    }

    function actualizarCarrito() {
        // Limpiar lista
        listaCarrito.innerHTML = '';
        
        // Mostrar mensaje de carrito vacío si no hay productos
        if (carrito.length === 0) {
            carritoVacio.style.display = 'block';
            btnRealizarPedido.disabled = true;
        } else {
            carritoVacio.style.display = 'none';
            btnRealizarPedido.disabled = false;
            
            // Agregar items al carrito
            carrito.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'item-carrito';
                div.innerHTML = `
                    <div class="info-item">
                        <h4>${item.producto}</h4>
                        <p>$${item.precio} c/u</p>
                    </div>
                    <div class="controles-item">
                        <button class="btn-cantidad" onclick="actualizarCantidad(${index}, ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="actualizarCantidad(${index}, ${item.cantidad + 1})">+</button>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                `;
                listaCarrito.appendChild(div);
            });
        }
        
        // Actualizar total y contador
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        totalElement.textContent = total;
        carritoContador.textContent = totalItems;
    }

    // Funcionalidad del formulario de pedido
    carritoIcono.addEventListener('click', () => {
        document.getElementById('carrito').scrollIntoView({ behavior: 'smooth' });
    });

    btnRealizarPedido.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        formularioPedido.showModal();
    });

    btnCancelarPedido.addEventListener('click', () => {
        formularioPedido.close();
    });

    formPedido.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(formPedido);
        const pedido = {
            nombre: formData.get('nombre'),
            usuario: formData.get('usuario'),
            direccion: formData.get('direccion'),
            telefono: formData.get('telefono'),
            codigoPostal: formData.get('codigo-postal'),
            tipoVivienda: formData.get('tipo-vivienda'),
            referencia: formData.get('referencia'),
            comentarios: formData.get('comentarios'),
            productos: carrito,
            total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
        };
        
        // Aquí enviarías el pedido al servidor
        console.log('Pedido realizado:', pedido);
        
        // Mostrar confirmación
        alert('¡Pedido realizado con éxito! Te contactaremos pronto.');
        
        // Limpiar carrito y cerrar modal
        formularioPedido.close();
        carrito = [];
        actualizarCarrito();
        formPedido.reset();
        
        // Mostrar notificación de confirmación
        mostrarNotificacion('¡Pedido confirmado! Gracias por tu compra.');
    });

    // Cerrar modal al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (e.target === formularioPedido) {
            formularioPedido.close();
        }
    });

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje) {
        // Verificar si ya existe una notificación
        const notificacionExistente = document.querySelector('.notificacion');
        if (notificacionExistente) {
            notificacionExistente.remove();
        }

        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: #000000;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }, 2000);
    }

    // Hacer funciones globales para los botones del carrito
    window.actualizarCantidad = actualizarCantidad;
    window.eliminarDelCarrito = eliminarDelCarrito;

    // Inicialización
    actualizarCarrito();
});