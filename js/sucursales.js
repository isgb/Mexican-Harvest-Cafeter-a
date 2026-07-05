/* Mexican Harvest — selector de sucursal en el mapa
   Al tocar una tarjeta de sucursal, el mapa se actualiza
   con la dirección guardada en su atributo data-mapa. */

document.addEventListener("DOMContentLoaded", function () {
  const mapa = document.querySelector("#mapa-sucursales");
  const tarjetas = document.querySelectorAll(".tarjeta-sucursal[data-mapa]");
  if (!mapa || tarjetas.length === 0) return;

  tarjetas.forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function () {
      mostrarSucursalEnMapa(mapa, tarjeta);
      marcarTarjetaActiva(tarjetas, tarjeta);
    });
  });
});

function mostrarSucursalEnMapa(mapa, tarjeta) {
  const direccion = tarjeta.dataset.mapa;
  const nombre = tarjeta.dataset.nombre;

  mapa.src = "https://www.google.com/maps?q=" + encodeURIComponent(direccion) + "&output=embed";
  mapa.title = "Mapa de la sucursal " + nombre + " de Mexican Harvest";

  /* En pantallas chicas el mapa queda fuera de vista: lo acercamos */
  mapa.closest(".marco-mapa").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function marcarTarjetaActiva(tarjetas, tarjetaElegida) {
  tarjetas.forEach(function (tarjeta) {
    tarjeta.classList.remove("activa");
  });
  tarjetaElegida.classList.add("activa");
}
