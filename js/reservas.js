/* Mexican Harvest — formulario de reservaciones
   Listo para conectarse a un backend; por ahora valida
   y ofrece confirmar por WhatsApp. */

const TELEFONO_WHATSAPP = "522204284792";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.querySelector("#formulario-reservas");
  if (!formulario) return;

  limitarFechaMinima(formulario);

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarCampos(formulario)) return;

    /* Punto de integración con backend:
       enviar aquí los datos con fetch() cuando exista la API. */
    const datos = leerDatosReserva(formulario);
    mostrarAvisoExito(formulario, "#aviso-reservas");
    prepararEnlaceWhatsApp(datos);
  });
});

function limitarFechaMinima(formulario) {
  const campoFecha = formulario.querySelector('input[type="date"]');
  if (!campoFecha) return;

  const hoy = new Date().toISOString().split("T")[0];
  campoFecha.setAttribute("min", hoy);
}

function leerDatosReserva(formulario) {
  return {
    nombre: formulario.querySelector("#reserva-nombre").value.trim(),
    telefono: formulario.querySelector("#reserva-telefono").value.trim(),
    sucursal: formulario.querySelector("#reserva-sucursal").value,
    fecha: formulario.querySelector("#reserva-fecha").value,
    hora: formulario.querySelector("#reserva-hora").value,
    personas: formulario.querySelector("#reserva-personas").value,
    comentarios: formulario.querySelector("#reserva-comentarios").value.trim(),
  };
}

/* Arma el mensaje de WhatsApp con los datos de la reserva */
function prepararEnlaceWhatsApp(datos) {
  const enlace = document.querySelector("#confirmar-whatsapp");
  if (!enlace) return;

  let mensaje =
    "Hola Mexican Harvest 🦋 Quiero reservar una mesa.\n" +
    "Nombre: " + datos.nombre + "\n" +
    "Sucursal: " + datos.sucursal + "\n" +
    "Fecha: " + datos.fecha + " a las " + datos.hora + "\n" +
    "Personas: " + datos.personas;

  if (datos.comentarios !== "") {
    mensaje += "\nComentarios: " + datos.comentarios;
  }

  enlace.href = "https://wa.me/" + TELEFONO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
  enlace.classList.remove("d-none");
}
