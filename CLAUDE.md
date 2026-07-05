# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Sitio web estático (HTML + CSS + JavaScript vanilla, en español) de Mexican Harvest, cafetería de especialidad en Puebla. No hay build, bundler, framework ni dependencias de npm: Bootstrap 5 está incluido localmente (`css/bootstrap.min.css` y `js/bootstrap.bundle.min.js`) y las tipografías (Fraunces y Karla) se cargan desde Google Fonts.

## Cómo ejecutarlo

Usar un servidor local desde la raíz del proyecto:

```
python -m http.server 8000
# o
npx serve .
```

La página del menú carga `data/menu.json` con `fetch()`; si el sitio se abre con `file://`, el fetch falla y `menu.js` usa como respaldo la copia embebida `data/menu-datos.js` (`window.DATOS_MENU`). **Ambos archivos deben mantenerse sincronizados**: tras editar `menu.json`, regenerar la copia con:

```
node -e "const fs=require('fs');fs.writeFileSync('data/menu-datos.js','window.DATOS_MENU = '+JSON.stringify(JSON.parse(fs.readFileSync('data/menu.json','utf8')),null,2)+';\n')"
```

No hay tests ni linter configurados.

## Arquitectura

Son 5 páginas HTML independientes: `index.html`, `menu.html`, `nosotros.html`, `contacto.html` y `reservas.html`. Además existe `carta.html`, que **no es una página del sitio** sino el documento de impresión del que se genera el PDF descargable (ver "Carta en PDF").

**No hay templating.** La barra de navegación y el footer están duplicados en las 5 páginas. Cualquier cambio a la navegación, footer o `<head>` compartido debe replicarse manualmente en todos los HTML.

### CSS

Un archivo por área, cargados en este orden en cada página: `bootstrap.min.css` → `variables.css` → `global.css` → `navbar.css` → `hero.css` → `cards.css` → `menu.css` → `forms.css` → `footer.css` → `responsive.css`.

`css/variables.css` define todos los tokens de diseño (paleta de marca: `--color-crema`, `--color-vino`, `--color-tinta`, `--color-miel`, etc., tipografías y transiciones). Usar siempre estas variables en vez de colores en duro.

Patrones de sección reutilizables: `.seccion-tinta` y `.seccion-carta` (fondos oscuros), `.cabecera-oscura` (encabezado interior con foto de fondo vía `style="background-image:..."` y velo oscuro), `.banner-fotografico` (banda con parallax) y `.rejilla-bento` (mosaico de destacados del home).

### JavaScript

Un archivo por funcionalidad. Cada script empieza con un `querySelector` y sale con `return` si el elemento no existe en la página, así que son seguros de incluir en cualquier HTML. Todos se cargan al final del `<body>` sin `defer` ni módulos ES.

- `main.js` — botón "volver arriba" y año del footer (todas las páginas)
- `navbar.js` — marca el enlace activo comparando con el nombre de archivo de la URL, y agrega sombra al hacer scroll
- `animations.js` — IntersectionObserver que agrega la clase `visible` a elementos con clase `revelar` (con variantes `revelar-retraso-1/2/3` para escalonar)
- `menu.js` — renderiza la carta en `#contenedor-menu` (foto fija por categoría + lista de platillos con variantes) y genera los chips de `#navegacion-menu`, una barra sticky con scrollspy: un IntersectionObserver resalta el chip de la categoría visible. Si un platillo tiene `variantes`, el precio principal se muestra como "desde $X" (el mínimo)
- `gallery.js` — lightbox propio construido en JS para los enlaces dentro de `[data-galeria]`
- `sucursales.js` — al hacer clic en una `.tarjeta-sucursal`, actualiza el iframe `#mapa-sucursales` de Google Maps con el atributo `data-mapa` de la tarjeta
- `contact.js` — validación de los formularios de contacto y boletín; también da las funciones compartidas `validarCampos()` y `mostrarAvisoExito()` que usa `reservas.js` (por eso `reservas.html` carga `contact.js` antes que `reservas.js`)
- `reservas.js` — formulario de reservaciones: valida y arma un enlace de WhatsApp con los datos (constante `TELEFONO_WHATSAPP` al inicio del archivo)

**Los formularios no tienen backend.** Los `submit` hacen `preventDefault()`, validan y muestran un aviso de éxito. Los puntos de integración futura están marcados con comentarios en `contact.js` y `reservas.js`.

### Datos

`data/menu.json` es la fuente del menú (actualmente es una **carta provisional**, ver su campo `nota`). Estructura: `categorias[]` con `id`, `nombre`, `descripcion`, `imagen` (ruta de la foto lateral), `pie_imagen` (leyenda de la foto) y `platillos[]` (`nombre`, `descripcion`, `precio`, `insignia` y opcionalmente `variantes[]` con `{nombre, precio}` para tamaños o presentaciones). Los valores válidos de `insignia` son `""`, `"favorito"` y `"nuevo"` (cualquier otro se ignora en `menu.js`).

Al cambiar el menú hay que actualizar **tres cosas**: `menu.json`, su copia embebida `data/menu-datos.js` (comando en "Cómo ejecutarlo") y el PDF de la carta (ver abajo), cuyo contenido está escrito a mano en `carta.html`.

### Carta en PDF

El botón "Carta PDF" de la navbar descarga `assets/carta-mexican-harvest.pdf`. Ese PDF se genera desde `carta.html` (documento de impresión A4 de 3 páginas, autocontenido, con paginación manual mediante `.pagina`) usando Edge headless:

```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=12000 --print-to-pdf="<ruta>\assets\carta-mexican-harvest.pdf" "file:///<ruta>/carta.html"
```

Cuidados de rendimiento aprendidos: **no usar degradados de fondo en `carta.html`** (se rasterizan a página completa y el PDF se vuelve lento de navegar) y usar las fotos reducidas de `assets/images/pdf/` (~520 px), no las originales.

## Convenciones

- Todo el código está en español: nombres de funciones, variables, clases CSS y comentarios (`cargarMenu`, `.tarjeta-sucursal`, `--color-vino`). Mantener esa convención en código nuevo.
- Nombres completos y descriptivos, sin abreviaturas.
- Cada página tiene su propio JSON-LD de datos estructurados, meta tags Open Graph y URL canónica hacia `https://www.mexicanharvest.mx/`. Si se agrega una página, actualizar también `sitemap.xml`.
