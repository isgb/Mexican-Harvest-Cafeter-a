/* Mexican Harvest — validación del formulario de contacto y boletín */

document.addEventListener("DOMContentLoaded", function () {
  iniciarFormularioContacto();
  iniciarFormularioBoletin();
});

function iniciarFormularioContacto() {
  const formulario = document.querySelector("#formulario-contacto");
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const esValido = validarCampos(formulario);
    if (!esValido) return;

    /* Aquí se conectará el backend o servicio de correo más adelante */
    mostrarAvisoExito(formulario, "#aviso-contacto");
    formulario.reset();
  });
}

function iniciarFormularioBoletin() {
  const formulario = document.querySelector("#formulario-boletin");
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correo = formulario.querySelector('input[type="email"]');
    if (!correoEsValido(correo.value)) {
      correo.classList.add("invalido");
      correo.focus();
      return;
    }

    correo.classList.remove("invalido");
    const aviso = formulario.querySelector(".aviso-exito");
    if (aviso) aviso.classList.add("visible");
    formulario.reset();
  });
}

/* ---------- Funciones compartidas de validación ---------- */

function validarCampos(formulario) {
  let esValido = true;
  const campos = formulario.querySelectorAll("[required]");

  campos.forEach(function (campo) {
    const error = campo.closest(".campo-formulario")?.querySelector(".mensaje-error");
    let campoValido = campo.value.trim() !== "";

    if (campoValido && campo.type === "email") {
      campoValido = correoEsValido(campo.value);
    }

    campo.classList.toggle("invalido", !campoValido);
    if (error) error.classList.toggle("visible", !campoValido);
    if (!campoValido) esValido = false;
  });

  return esValido;
}

function correoEsValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function mostrarAvisoExito(formulario, selectorAviso) {
  const aviso = document.querySelector(selectorAviso);
  if (!aviso) return;

  aviso.classList.add("visible");
  aviso.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(function () {
    aviso.classList.remove("visible");
  }, 6000);
}
