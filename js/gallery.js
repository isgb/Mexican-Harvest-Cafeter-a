/* Mexican Harvest — galería con lightbox propio */

document.addEventListener("DOMContentLoaded", function () {
  const enlacesGaleria = document.querySelectorAll("[data-galeria] a");
  if (enlacesGaleria.length === 0) return;

  const cajaLuz = crearCajaLuz();
  let indiceActual = 0;

  const fotos = Array.from(enlacesGaleria).map(function (enlace) {
    return {
      ruta: enlace.getAttribute("href"),
      titulo: enlace.dataset.titulo || "Mexican Harvest",
    };
  });

  enlacesGaleria.forEach(function (enlace, indice) {
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();
      indiceActual = indice;
      abrirCajaLuz();
    });
  });

  function crearCajaLuz() {
    const caja = document.createElement("div");
    caja.className = "caja-luz";
    caja.setAttribute("role", "dialog");
    caja.setAttribute("aria-label", "Galería de fotos");
    caja.innerHTML =
      '<button type="button" class="cerrar-caja" aria-label="Cerrar galería">✕</button>' +
      '<button type="button" class="anterior-caja" aria-label="Foto anterior">←</button>' +
      '<img src="" alt="">' +
      '<button type="button" class="siguiente-caja" aria-label="Foto siguiente">→</button>' +
      '<p class="pie-caja-luz"></p>';
    document.body.appendChild(caja);

    caja.querySelector(".cerrar-caja").addEventListener("click", cerrarCajaLuz);
    caja.querySelector(".anterior-caja").addEventListener("click", function () {
      moverFoto(-1);
    });
    caja.querySelector(".siguiente-caja").addEventListener("click", function () {
      moverFoto(1);
    });

    /* Cerrar al hacer clic fuera de la imagen */
    caja.addEventListener("click", function (evento) {
      if (evento.target === caja) cerrarCajaLuz();
    });

    document.addEventListener("keydown", function (evento) {
      if (!caja.classList.contains("abierta")) return;
      if (evento.key === "Escape") cerrarCajaLuz();
      if (evento.key === "ArrowLeft") moverFoto(-1);
      if (evento.key === "ArrowRight") moverFoto(1);
    });

    return caja;
  }

  function abrirCajaLuz() {
    mostrarFotoActual();
    cajaLuz.classList.add("abierta");
    document.body.style.overflow = "hidden";
  }

  function cerrarCajaLuz() {
    cajaLuz.classList.remove("abierta");
    document.body.style.overflow = "";
  }

  function moverFoto(direccion) {
    indiceActual = (indiceActual + direccion + fotos.length) % fotos.length;
    mostrarFotoActual();
  }

  function mostrarFotoActual() {
    const foto = fotos[indiceActual];
    const imagen = cajaLuz.querySelector("img");
    imagen.src = foto.ruta;
    imagen.alt = foto.titulo;
    cajaLuz.querySelector(".pie-caja-luz").textContent =
      foto.titulo + " · " + (indiceActual + 1) + " / " + fotos.length;
  }
});
