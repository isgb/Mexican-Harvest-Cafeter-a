/* Mexican Harvest — carta de la casa
   Pinta el menú desde data/menu.json, arma la navegación
   por categorías y resalta la sección visible al hacer scroll. */

// Si no hay servidor (file://) se usa la copia embebida en index.html
document.addEventListener("DOMContentLoaded", function () {
  const contenedorMenu = document.querySelector("#contenedor-menu");
  if (!contenedorMenu) return;

  cargarMenu(contenedorMenu);
});

async function cargarMenu(contenedorMenu) {
  try {
    const respuesta = await fetch("data/menu.json");
    if (!respuesta.ok) {
      throw new Error("No se pudo leer el menú");
    }

    const datos = await respuesta.json();
    iniciarCarta(contenedorMenu, datos.categorias);
  } catch (error) {
    /* Sin servidor (file://) el fetch falla: usamos la copia embebida */
    if (window.DATOS_MENU) {
      iniciarCarta(contenedorMenu, window.DATOS_MENU.categorias);
      return;
    }

    contenedorMenu.innerHTML =
      '<p class="nota-menu">No pudimos cargar el menú en este momento. ' +
      "Visita nuestra barra para conocer la carta completa.</p>";
    console.error(error);
  }
}

function iniciarCarta(contenedorMenu, categorias) {
  pintarMenu(contenedorMenu, categorias);
  pintarNavegacion(categorias);
  observarCategoriaVisible();
}

/* ---------- Render de la carta ---------- */
function pintarMenu(contenedorMenu, categorias) {
  contenedorMenu.innerHTML = categorias.map(crearGrupoHtml).join("");
}

function crearGrupoHtml(categoria, indice) {
  const numero = String(indice + 1).padStart(2, "0");
  const claseInvertido = indice % 2 === 1 ? " grupo-invertido" : "";
  const platillosHtml = categoria.platillos.map(crearPlatilloHtml).join("");

  let descripcionHtml = "";
  if (categoria.descripcion !== "") {
    descripcionHtml =
      '<p class="descripcion-grupo">' + categoria.descripcion + "</p>";
  }

  return (
    '<section class="grupo-menu' +
    claseInvertido +
    '" id="grupo-' +
    categoria.id +
    '" data-categoria="' +
    categoria.id +
    '">' +
    '<header class="cabecera-grupo">' +
    '<span class="numero-grupo">N.º ' +
    numero +
    "</span>" +
    "<h2>" +
    categoria.nombre +
    "</h2>" +
    "</header>" +
    descripcionHtml +
    '<div class="cuerpo-grupo">' +
    crearFotoHtml(categoria) +
    '<div class="lista-grupo">' +
    platillosHtml +
    "</div>" +
    "</div>" +
    "</section>"
  );
}

function crearFotoHtml(categoria) {
  // Si no hay imagen, no se pinta el <figure> para que el texto ocupe todo el ancho
  if (!categoria.imagen) return "";

  return (
    '<figure class="foto-grupo">' +
    '<img src="' +
    categoria.imagen +
    '" alt="' +
    categoria.nombre +
    " en Mexican Harvest" +
    '" loading="lazy" width="600" height="750">' +
    "<figcaption>" +
    (categoria.pie_imagen || categoria.nombre) +
    "</figcaption>" +
    "</figure>"
  );
}

function crearPlatilloHtml(platillo) {
  let insigniaHtml = "";
  if (platillo.insignia === "favorito") {
    insigniaHtml = '<span class="insignia">Favorito</span>';
  }
  if (platillo.insignia === "nuevo") {
    insigniaHtml = '<span class="insignia nuevo">Nuevo</span>';
  }

  let descripcionHtml = "";
  if (platillo.descripcion !== "") {
    descripcionHtml =
      '<p class="descripcion-platillo">' + platillo.descripcion + "</p>";
  }

  return (
    '<article class="platillo">' +
      '<div class="encabezado-platillo">' +
        '<span class="nombre-platillo">' +
        platillo.nombre +
        "</span>" +
        insigniaHtml +
        '<span class="relleno-puntos" aria-hidden="true"></span>' +
        crearPrecioHtml(platillo) +
      "</div>" +
      descripcionHtml +
      crearVariantesHtml(platillo) +
    "</article>"
  );
}

/* Si hay variantes, el precio general se sustituye por "desde" */
function crearPrecioHtml(platillo) {
  if (platillo.variantes && platillo.variantes.length > 0) {
    const precios = platillo.variantes.map(function (variante) {
      return variante.precio;
    });
    const menor = Math.min.apply(null, precios);
    return '<span class="precio">desde $' + menor + "</span>";
  }

  return '<span class="precio">$' + platillo.precio + "</span>";
}

function crearVariantesHtml(platillo) {
  if (!platillo.variantes || platillo.variantes.length === 0) return "";

  const chips = platillo.variantes.map(function (variante) {
    return (
      '<span class="variante">' +
      variante.nombre +
      " <strong>$" +
      variante.precio +
      "</strong></span>"
    );
  });

  return '<div class="variantes">' + chips.join("") + "</div>";
}

/* ---------- Navegación rápida por categorías ---------- */

function pintarNavegacion(categorias) {
  const navegacion = document.querySelector(
    "#navegacion-menu .pista-navegacion",
  );
  if (!navegacion) return;

  navegacion.innerHTML = categorias
    .map(function (categoria) {
      return (
        '<button type="button" class="chip-menu" data-destino="grupo-' +
        categoria.id +
        '">' +
        categoria.nombre +
        "</button>"
      );
    })
    .join("");

  navegacion.addEventListener("click", function (evento) {
    const chip = evento.target.closest(".chip-menu");
    if (!chip) return;

    const destino = document.getElementById(chip.dataset.destino);
    if (destino) {
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

/* Resalta en la navegación la categoría que se está viendo */
function observarCategoriaVisible() {
  const grupos = document.querySelectorAll(".grupo-menu");
  if (grupos.length === 0 || !("IntersectionObserver" in window)) return;

  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;

        const chips = document.querySelectorAll(".chip-menu");
        chips.forEach(function (chip) {
          const coincide = chip.dataset.destino === entrada.target.id;
          chip.classList.toggle("activo", coincide);
          if (coincide) {
            chip.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );

  grupos.forEach(function (grupo) {
    observador.observe(grupo);
  });
}
