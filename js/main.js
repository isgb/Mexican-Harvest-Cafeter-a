/* Mexican Harvest — comportamiento general del sitio */

document.addEventListener("DOMContentLoaded", function () {
  iniciarBotonVolverArriba();
  actualizarAnioFooter();
});

function iniciarBotonVolverArriba() {
  const boton = document.querySelector(".volver-arriba");
  if (!boton) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      boton.classList.add("visible");
    } else {
      boton.classList.remove("visible");
    }
  });

  boton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function actualizarAnioFooter() {
  const anio = document.querySelector("[data-anio-actual]");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }
}
