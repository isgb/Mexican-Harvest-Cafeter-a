/* Mexican Harvest — barra de navegación */

document.addEventListener("DOMContentLoaded", function () {
  marcarEnlaceActivo();
  sombraAlHacerScroll();
});

/* Resalta el enlace de la página actual */
function marcarEnlaceActivo() {
  const rutaActual = window.location.pathname.split("/").pop() || "index.html";
  const enlaces = document.querySelectorAll(".barra-navegacion .nav-link");

  enlaces.forEach(function (enlace) {
    const destino = enlace.getAttribute("href");
    if (destino === rutaActual) {
      enlace.classList.add("activo");
      enlace.setAttribute("aria-current", "page");
    }
  });
}

/* Agrega sombra a la barra cuando el usuario baja */
function sombraAlHacerScroll() {
  const barra = document.querySelector(".barra-navegacion");
  if (!barra) return;

  window.addEventListener("scroll", function () {
    barra.classList.toggle("con-sombra", window.scrollY > 40);
  });
}
