/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   MODAL DE AGENTE — WHATSAPP / LLAMADA
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   VARIABLES DEL MODAL
============================================================ */

let modalAgenteActivo = null;


/* ============================================================
   ABRIR MENÚ DE AGENTE
============================================================ */

function abrirMenuAgente(
    nombre,
    turno,
    fecha
) {

    modalAgenteActivo = {

        nombre:
            nombre || "",

        turno:
            turno || "",

        fecha:
            fecha || ""

    };


    /*
       Eliminamos cualquier modal anterior.
    */

    cerrarMenuAgente();


    /*
       Creamos el fondo del modal.
    */

    const fondo =
        document.createElement("div");

    fondo.id =
        "modalAgente";

    fondo.className =
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4";


    /*
       Contenedor principal.
    */

    const contenido =
        document.createElement("div");

    contenido.className =
        "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden";


    /*
       Cabecera.
    */

    const cabecera =
        document.createElement("div");

    cabecera.className =
        "bg-[#0A2342] text-white px-6 py-5";


    const titulo =
        document.createElement("h2");

    titulo.className =
        "text-2xl font-bold text-center";

    titulo.textContent =
        nombre || "Agente";


    cabecera.appendChild(
        titulo
    );


    /*
       Información del servicio.
    */

    const informacion =
        document.createElement("div");

    informacion.className =
        "px-6 pt-5 text-center";


    const textoFecha =
        document.createElement("p");

    textoFecha.className =
        "text-gray-600 mb-1";

    textoFecha.textContent =
        fecha
            ? fecha
            : "";


    const textoTurno =
        document.createElement("p");

    textoTurno.className =
        "font-semibold text-[#0A2342]";

    textoTurno.textContent =
        obtenerTextoTurno(turno);


    informacion.appendChild(
        textoFecha
    );

    informacion.appendChild(
        textoTurno
    );


    /*
       Zona de botones.
    */

    const botones =
        document.createElement("div");

    botones.className =
        "p-6 space-y-3";


    /*
       BOTÓN WHATSAPP
    */

    const botonWhatsApp =
        document.createElement("button");

    botonWhatsApp.type =
        "button";

    botonWhatsApp.className =
        "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition";

    botonWhatsApp.innerHTML =
        "🟢 WhatsApp";


    botonWhatsApp.addEventListener(
        "click",
        () => {

            abrirWhatsAppAgente(
                nombre,
                turno,
                fecha
            );

        }
    );


    /*
       BOTÓN LLAMAR
    */

    const botonLlamar =
        document.createElement("button");

    botonLlamar.type =
        "button";

    botonLlamar.className =
        "w-full bg-[#0A2342] hover:bg-[#12345f] text-white font-bold py-3 px-4 rounded-xl transition";

    botonLlamar.innerHTML =
        "📞 Llamar";


    botonLlamar.addEventListener(
        "click",
        () => {

            llamarAgente(
                nombre
            );

        }
    );


    /*
       BOTÓN ATRÁS
    */

    const botonAtras =
        document.createElement("button");

    botonAtras.type =
        "button";

    botonAtras.className =
        "w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition";

    botonAtras.textContent =
        TEXTOS.atras;


    botonAtras.addEventListener(
        "click",
        () => {

            cerrarMenuAgente();

        }
    );


    botones.appendChild(
        botonWhatsApp
    );

    botones.appendChild(
        botonLlamar
    );

    botones.appendChild(
        botonAtras
    );


    /*
       Construimos el modal.
    */

    contenido.appendChild(
        cabecera
    );

    contenido.appendChild(
        informacion
    );

    contenido.appendChild(
        botones
    );

    fondo.appendChild(
        contenido
    );


    /*
       Pulsar fuera del contenido
       también cierra el modal.
    */

    fondo.addEventListener(
        "click",
        event => {

            if (
                event.target === fondo
            ) {

                cerrarMenuAgente();

            }

        }
    );


    /*
       ESC también cierra.
    */

    document.addEventListener(
        "keydown",
        manejarEscapeModal
    );


    document.body.appendChild(
        fondo
    );

}


/* ============================================================
   TEXTO DEL TURNO
============================================================ */

function obtenerTextoTurno(turno) {

    const codigo =
        String(turno || "").trim();


    switch (codigo) {

        case TURNOS.MANANA:

            return "Turno: Mañana";


        case TURNOS.NOCHE:

            return "Turno: Noche";


        case TURNOS.PLAYA:

            return "Turno: Playa";


        case HORAS_EXTRAS.MANANA_12:

            return "Horas Extras: Mañana 12h";


        case HORAS_EXTRAS.NOCHE_12:

            return "Horas Extras: Noche 12h";


        case HORAS_EXTRAS.MANANA_8:

            return "Horas Extras: Mañana 8h";


        case HORAS_EXTRAS.TARDE_8:

            return "Horas Extras: Tarde 8h";


        case HORAS_EXTRAS.NOCHE_8:

            return "Horas Extras: Noche 8h";


        case HORAS_EXTRAS.PLAYA:

            return "Horas Extras: Playa";


        default:

            return codigo
                ? `Turno: ${codigo}`
                : "";

    }

}


/* ============================================================
   CERRAR MENÚ DE AGENTE
============================================================ */

function cerrarMenuAgente() {

    const modal =
        obtenerElemento(
            "modalAgente"
        );


    if (modal) {

        modal.remove();

    }


    modalAgenteActivo =
        null;


    document.removeEventListener(
        "keydown",
        manejarEscapeModal
    );

}


/* ============================================================
   ESC PARA CERRAR
============================================================ */

function manejarEscapeModal(event) {

    if (
        event.key === "Escape"
    ) {

        cerrarMenuAgente();

    }

}


/* ============================================================
   ABRIR WHATSAPP
============================================================ */

function abrirWhatsAppAgente(
    nombre,
    turno,
    fecha
) {

    const telefono =
        obtenerTelefono(
            nombre
        );


    /*
       Si no existe teléfono,
       no intentamos construir un enlace
       incorrecto.
    */

    if (!telefono) {

        alert(
            "No hay un número de teléfono registrado para este agente."
        );

        return;

    }


    /*
       Limpiamos el número para construir
       correctamente el enlace de WhatsApp.
    */

    const numero =
        limpiarNumeroTelefono(
            telefono
        );


    /*
       Si el JSON ya contiene un número
       internacional, lo utilizamos.

       Si contiene un número español de
       9 dígitos, añadimos +34.
    */

    let numeroWhatsApp =
        numero;


    if (
        numeroWhatsApp.length === 9
    ) {

        numeroWhatsApp =
            "34" +
            numeroWhatsApp;

    }


    /*
       Construimos el mensaje.

       El nombre corresponde al compañero
       pulsado.

       La fecha corresponde al día elegido.

       El turno corresponde al servicio
       que aparece en la aplicación.
    */

    const mensaje =
        construirMensajeWhatsApp(
            nombre,
            turno,
            fecha
        );


    const url =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;


    window.open(
        url,
        "_blank"
    );

}


/* ============================================================
   CONSTRUIR MENSAJE WHATSAPP
============================================================ */

function construirMensajeWhatsApp(
    nombre,
    turno,
    fecha
) {

    const turnoTexto =
        obtenerTextoTurnoMensaje(
            turno
        );


    return (
        `Hola ${nombre}, ` +
        `te escribo desde la app porque ` +
        `el día ${fecha} estamos juntos ` +
        `en el turno de ${turnoTexto}`
    );

}


/* ============================================================
   TEXTO DEL TURNO PARA WHATSAPP
============================================================ */

function obtenerTextoTurnoMensaje(
    turno
) {

    const codigo =
        String(turno || "").trim();


    switch (codigo) {

        case TURNOS.MANANA:

            return "mañana";


        case TURNOS.NOCHE:

            return "noche";


        case TURNOS.PLAYA:

            return "playa";


        case HORAS_EXTRAS.MANANA_12:

            return "mañana 12h";


        case HORAS_EXTRAS.NOCHE_12:

            return "noche 12h";


        case HORAS_EXTRAS.MANANA_8:

            return "mañana 8h";


        case HORAS_EXTRAS.TARDE_8:

            return "tarde 8h";


        case HORAS_EXTRAS.NOCHE_8:

            return "noche 8h";


        case HORAS_EXTRAS.PLAYA:

            return "playa";


        default:

            return codigo;

    }

}


/* ============================================================
   LIMPIAR TELÉFONO
============================================================ */

function limpiarNumeroTelefono(
    telefono
) {

    return String(telefono || "")
        .replace(
            /[^\d+]/g,
            ""
        )
        .replace(
            /^\+/,
            ""
        );

}


/* ============================================================
   LLAMAR A UN AGENTE
============================================================ */

function llamarAgente(
    nombre
) {

    const telefono =
        obtenerTelefono(
            nombre
        );


    if (!telefono) {

        alert(
            "No hay un número de teléfono registrado para este agente."
        );

        return;

    }


    const numero =
        limpiarNumeroTelefono(
            telefono
        );


    window.location.href =
        `tel:${numero}`;

}


/* ============================================================
   CERRAR TODOS LOS MODALES
============================================================ */

function cerrarTodosLosModales() {

    cerrarMenuAgente();


    /*
       Por ahora el único modal de la aplicación
       es el menú del agente.

       Los futuros modales podrán añadirse aquí.
    */

}


/* ============================================================
   FIN DE modal.js
============================================================ */