document.addEventListener("DOMContentLoaded", function() {

    // === LOGIN ===
    const formLogin = document.getElementById("loginForm");
    if (formLogin) {

        // Enlace para ir a la página de registro
        const registrarLink = document.querySelector(".registrar a");
        if (registrarLink) {
            registrarLink.addEventListener("click", function(event) {
                event.preventDefault();
                window.location.href = "Registro.html";
            });
        }

        // Evento submit para login
        formLogin.addEventListener("submit", async function(event) {
            event.preventDefault();

            const usuario = document.getElementById("usuario").value;
            const contraseña = document.getElementById("contraseña").value;

            try {
                const response = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usuario, contraseña })
                });
                const result = await response.json();

                if (result.exito) {
    const rol = result.rol.trim().toLowerCase();
    console.log("Rol recibido desde backend:", rol); // 👈
    alert("Bienvenido 🟢 (" + rol + ")");

    switch (rol) {
        case "administrador":
            window.location.href = "/Vistas_de_inicio/admin.html";
            break;
        case "editor":
            window.location.href = "/Vistas_de_inicio/editor.html";
            break;
        case "consultor":
            window.location.href = "/Vistas_de_inicio/consultor.html";
            break;
        case "usuario":
            window.location.href = "/Vistas_de_inicio/cliente.html";
            break;
        default:
            alert("Rol desconocido: " + rol);
    }
} else {
    alert("Usuario o contraseña incorrectos ❌");
}
            } catch (error) {
                alert("Error de conexión con el servidor");
                console.error(error);
            }
        });
    }

    // === REGISTRO ===
    const formRegistro = document.getElementById("registroForm");
    if (formRegistro) {

        // Evento submit para registro
        formRegistro.addEventListener("submit", async function(event) {
            event.preventDefault();

            const usuario = document.getElementById("usuario").value;
            const correo = document.getElementById("correo").value;
            const contraseña = document.getElementById("contraseña").value;

            try {
                const response = await fetch("http://127.0.0.1:5000/registrar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usuario, correo, contraseña })
                });
                const result = await response.json();

                if (result.exito) {
                    alert("Usuario registrado correctamente 🟩");
                    window.location.href = "inicio_sesion.html";
                } else {
                    alert("Error: " + result.error);
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
                console.error(error);
            }
        });

        // Enlace para volver al login
        const volverLink = document.getElementById("volverLogin");
        if (volverLink) {
            volverLink.addEventListener("click", function(event) {
                event.preventDefault();
                window.location.href = "inicio_sesion.html";
            });
        }
    }
});


