document.addEventListener("DOMContentLoaded", function() {

    // === LOGIN ===
    const formLogin = document.getElementById("loginForm");
    if (formLogin) {

        // Enlace para ir a la página de registro
        const registrarLink = document.querySelector(".registrar a");
        if (registrarLink) {
            registrarLink.addEventListener("click", function(event) {
                event.preventDefault();
                // ✅ Ruta Flask
                window.location.href = "/registro";
            });
        }

        // Evento submit para login
        formLogin.addEventListener("submit", async function(event) {
            event.preventDefault();

            const usuario = document.getElementById("usuario").value;
            const contraseña = document.getElementById("contraseña").value;

            try {
                // ✅ En Render y local usa misma URL base
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usuario, contraseña })
                });
                const result = await response.json();

                if (result.exito) {
                    const rol = result.rol.trim().toLowerCase();
                    console.log("Rol recibido desde backend:", rol);
                    alert("Bienvenido 🟢 (" + rol + ")");

                    switch (rol) {
                        case "administrador":
                            window.location.href = "/vista/admin";
                            break;
                        case "editor":
                            window.location.href = "/vista/editor";
                            break;
                        case "consultor":
                            window.location.href = "/vista/consultor";
                            break;
                        case "usuario":
                            window.location.href = "/vista/cliente";
                            break;
                        default:
                            alert("Rol desconocido: " + rol);
                    }
                } else {
                    alert("Usuario o contraseña incorrectos ❌");
                }
            } catch (error) {
                alert("Error de conexión con el servidor ⚠️");
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
                const response = await fetch("/registrar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usuario, correo, contraseña })
                });
                const result = await response.json();

                if (result.exito) {
                    alert("Usuario registrado correctamente 🟩");
                    // ✅ vuelve al login Flask
                    window.location.href = "/";
                } else {
                    alert("Error: " + result.error);
                }
            } catch (error) {
                alert("Error de conexión con el servidor ⚠️");
                console.error(error);
            }
        });

        // Enlace para volver al login
        const volverLink = document.getElementById("volverLogin");
        if (volverLink) {
            volverLink.addEventListener("click", function(event) {
                event.preventDefault();
                // ✅ Redirige al login Flask
                window.location.href = "/";
            });
        }
    }
});



