# Mexican Harvest · Cafés Especiales ☕🦋

Sitio web de **Mexican Harvest**, cafetería de especialidad en Puebla, México — Top 50 de *The Best Coffee Shops México 2025*. Tuestan y sirven granos 100% mexicanos de Puebla, Oaxaca, Chiapas y Veracruz.

Construido a mano con **HTML5, CSS3 y JavaScript vanilla**, sin frameworks ni proceso de build.

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Hero de pantalla completa, historia, café de especialidad, métodos de extracción, destacados en mosaico, galería con lightbox, testimonios, eventos, boletín, sucursales con mapa interactivo e Instagram |
| `menu.html` | Carta completa cargada desde JSON, con navegación fija por categorías (scrollspy), fotos por categoría y variantes de tamaño/presentación |
| `nosotros.html` | Historia, filosofía, valores, proceso del café en 5 pasos, calidad del grano y equipo |
| `contacto.html` | Formulario validado, datos de contacto, mapa y preguntas frecuentes |
| `reservas.html` | Formulario de reservación con confirmación por WhatsApp, listo para conectar a un backend |

Además, los clientes pueden **descargar la carta en PDF** desde el botón de la barra de navegación.

## Tecnologías

- **HTML5** semántico con SEO básico (meta tags, Open Graph, JSON-LD, sitemap, robots.txt, manifest)
- **CSS3** con variables de diseño propias (paleta extraída del branding real de la marca)
- **JavaScript vanilla** modular: un archivo por funcionalidad
- **Bootstrap 5** incluido localmente, solo para grid y componentes (acordeón, collapse)
- Tipografías: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Karla](https://fonts.google.com/specimen/Karla) vía Google Fonts

## Cómo ejecutarlo

No requiere instalación. Solo sirve la carpeta con cualquier servidor estático:

```bash
python -m http.server 8000
# o
npx serve .
```

y abre `http://localhost:8000`.

> El sitio también funciona abriendo `index.html` directo con doble clic: la página del menú usa una copia embebida de los datos (`data/menu-datos.js`) cuando `fetch()` no está disponible en `file://`.

## Estructura del proyecto

```
├── index.html · menu.html · nosotros.html · contacto.html · reservas.html
├── carta.html              # documento de impresión del PDF (no es página del sitio)
├── css/                    # un archivo por área (variables, global, navbar, hero…)
├── js/                     # un archivo por funcionalidad (menu, gallery, reservas…)
├── data/
│   ├── menu.json           # fuente única del menú
│   └── menu-datos.js       # copia embebida para file:// (generada desde el JSON)
├── assets/
│   ├── images/             # fotografías (images/pdf/ = versiones ligeras para el PDF)
│   ├── icons/              # favicon SVG
│   ├── logos/
│   └── carta-mexican-harvest.pdf
├── manifest.webmanifest · robots.txt · sitemap.xml
```

## Actualizar el menú

1. Edita `data/menu.json`. Cada categoría tiene `id`, `nombre`, `descripcion`, `imagen`, `pie_imagen` y sus `platillos[]`; cada platillo admite `insignia` (`"favorito"` / `"nuevo"`) y `variantes[]` de `{nombre, precio}`.
2. Regenera la copia embebida:
   ```bash
   node -e "const fs=require('fs');fs.writeFileSync('data/menu-datos.js','window.DATOS_MENU = '+JSON.stringify(JSON.parse(fs.readFileSync('data/menu.json','utf8')),null,2)+';\n')"
   ```
3. Actualiza `carta.html` (el contenido del PDF está escrito ahí) y regenera el PDF:
   ```bash
   "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=12000 --print-to-pdf="assets\carta-mexican-harvest.pdf" "file:///RUTA/carta.html"
   ```

## Datos de la cafetería

- **Horario:** lunes a domingo · 8:00 am — 10:30 pm
- **Sucursales:** Centro Comercial El Triángulo · 2 Sur 907 Centro Histórico · 3 Poniente esq. 5 Sur 105 · Blvrd. Esteban de Antuñano 1479
- **WhatsApp:** 220 428 4792 (reservaciones, pedidos y facturas)
- **Instagram:** [@mexican.harvest](https://www.instagram.com/mexican.harvest/) · **Facebook:** [MexicanHarvest](https://www.facebook.com/MexicanHarvest)

## Pendientes / integración futura

- [ ] Conectar los formularios de contacto y reservas a un backend (puntos de integración marcados con comentarios en `js/contact.js` y `js/reservas.js`)
- [ ] Sustituir la carta provisional por el menú real de la cafetería
- [ ] Conectar el feed real de Instagram (la estructura ya está preparada en `index.html`)

---

*“Aromas que despiertan tus sueños, sabores que te llevan al cielo.”*
