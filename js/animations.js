/* Mexican Harvest — animaciones de aparición al hacer scroll */

document.addEventListener("DOMContentLoaded", function () {
  const elementos = document.querySelectorAll(".revelar");
  if (elementos.length === 0) return;

  /* Si el navegador no soporta IntersectionObserver, se muestra todo */
  if (!("IntersectionObserver" in window)) {
    elementos.forEach(function (elemento) {
      elemento.classList.add("visible");
    });
    return;
  }

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elementos.forEach(function (elemento) {
    observador.observe(elemento);
  });
});
