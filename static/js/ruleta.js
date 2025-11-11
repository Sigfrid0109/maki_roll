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


document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".container");
    const btnSpin = document.getElementById("spin");
    const resultDialog = document.getElementById("resultDialog");
    const premioGanadoElement = document.getElementById("premioGanado");
    const closeDialogBtn = document.getElementById("closeDialog");

    let premios = [];

    // --- Cargar premios desde el backend ---
    try {
        const res = await fetch("http://localhost:5000/api/premios");
        const data = await res.json();
        premios = data.map(p => p.nombre);
    } catch (err) {
        console.error("Error cargando premios:", err);
        premios = ["Tira de nuevo", "5% de descuento", "10% de descuento", "15% de descuento", "30% de descuento", "60% de descuento", "40% de descuento", "50% de descuento"];
    }

    let number = 0;

    btnSpin.addEventListener("click", async () => {
        btnSpin.disabled = true;
        btnSpin.textContent = "Girando...";

        const nuevoGiro = 360 * 5 + Math.floor(Math.random() * 360);
        number += nuevoGiro;

        container.style.transition = "transform 4s ease-out";
        container.style.transform = `rotate(${number}deg)`;

        setTimeout(async () => {
            const anguloFinal = number % 360;
            const offset = 22.5;
            const indice = Math.floor((360 - anguloFinal + offset) / 45) % premios.length;
            let premioGanado = premios[indice];

            // Normalizar nombres
            premioGanado = premioGanado.trim();
            if (premioGanado.includes("%") && !premioGanado.toLowerCase().includes("descuento")) {
                premioGanado += " de descuento";
            }

            premioGanadoElement.textContent = premioGanado;
            resultDialog.showModal();

            // --- Mapa premio → id_premio en base de datos ---
            const premiosMap = {
                "Tira de nuevo": 9,
                "5% de descuento": 10,
                "10% de descuento": 11,
                "15% de descuento": 12,
                "30% de descuento": 13,
                "60% de descuento": 14,
                "40% de descuento": 15,
                "50% de descuento": 16
            };

            const idUsuarioActual = 1; // <- CAMBIA ESTO SI USAS SESIÓN
            const idPremio = premiosMap[premioGanado];

            if (!idPremio) {
                console.error("El premio no coincide con premiosMap:", premioGanado);
            } else {
                try {
                    const resp = await fetch("http://localhost:5000/api/resultados", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_usuario: idUsuarioActual,
                            id_premio: idPremio
                        })
                    });

                    const respuesta = await resp.json();
                    console.log("Respuesta del backend:", respuesta);
                } catch (err) {
                    console.error("Error enviando el resultado:", err);
                }
            }

            btnSpin.disabled = false;
            btnSpin.textContent = "Girar";
        }, 4000);
    });

    closeDialogBtn.addEventListener("click", () => resultDialog.close());
});


