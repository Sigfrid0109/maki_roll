document.addEventListener("DOMContentLoaded", function() {

    // === LOGIN ===
    const formLogin = document.getElementById("loginForm");
    if (formLogin) {

        // Enlace para ir a la página de registro
        const registrarLink = document.querySelector(".registrar a");
        if (registrarLink) {
            registrarLink.addEventListener("click", function(event) {
                event.preventDefault();
                // ✅ ahora usa la ruta Flask
                window.location.href = "/registro";
            });
        }

        // Evento submit para login
        formLogin.addEventListener("submit", async function(event) {
            event.preventDefault();

            const usuario = document.getElementById("usuario").value;
            const contraseña = document.getElementById("contraseña").value;

            try {
                // ✅ sin dirección local, usa la misma URL base (Render o local)
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
                            window.location.href = "/Vista_de_inicio/admin.html";
                            break;
                        case "editor":
                            window.location.href = "/Vista_de_inicio/editor.html";
                            break;
                        case "consultor":
                            window.location.href = "/Vista_de_inicio/consultor.html";
                            break;
                        case "usuario":
                            window.location.href = "/Vista_de_inicio/cliente.html";
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
                // ✅ redirige a la raíz Flask
                window.location.href = "/";
            });
        }
    }
});



