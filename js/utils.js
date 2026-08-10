/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   FUNCIONES AUXILIARES
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   OBTENER FECHA ACTUAL
============================================================ */

function obtenerFechaActual() {

    const hoy = new Date();

    return {

        dia:
            hoy.getDate(),

        mes:
            hoy.getMonth() + 1,

        año:
            hoy.getFullYear()

    };

}


/* ============================================================
   OBTENER NOMBRE DEL MES
============================================================ */

function obtenerNombreMes(numeroMes) {

    const mes =
        MESES[parseInt(numeroMes)];

    return mes || "";

}


/* ============================================================
   OBTENER FECHA FORMATEADA
============================================================ */

function obtenerFechaFormateada(dia, mes) {

    const nombreMes =
        obtenerNombreMes(mes);

    return `${dia} de ${nombreMes}`;

}


/* ============================================================
   NORMALIZAR TEXTO
============================================================ */

function normalizarTexto(texto) {

    if (texto === null || texto === undefined) {

        return "";

    }

    return String(texto)
        .trim()
        .toUpperCase();

}


/* ============================================================
   COMPARAR TEXTOS
============================================================ */

function textosIguales(texto1, texto2) {

    return (
        normalizarTexto(texto1) ===
        normalizarTexto(texto2)
    );

}


/* ============================================================
   COMPROBAR SI UN TURNO ES OPERATIVO
============================================================ */

function esTurnoOperativo(turno) {

    const codigo =
        normalizarTexto(turno);

    return (

        codigo === TURNOS.MANANA ||

        codigo === TURNOS.NOCHE ||

        codigo === TURNOS.PLAYA

    );

}


/* ============================================================
   COMPROBAR SI ES UN ESTADO NO OPERATIVO
============================================================ */

function esEstadoNoOperativo(turno) {

    const codigo =
        normalizarTexto(turno);

    return Object.values(
        ESTADOS_NO_OPERATIVOS
    ).includes(codigo);

}


/* ============================================================
   COMPROBAR SI ES HORA EXTRA
============================================================ */

function esHoraExtra(turno) {

    const codigo =
        String(turno).trim();

    return Object.values(
        HORAS_EXTRAS
    ).includes(codigo);

}


/* ============================================================
   OBTENER TIPO DE HORA EXTRA
============================================================ */

function obtenerTipoHoraExtra(turno) {

    const codigo =
        String(turno).trim();

    switch (codigo) {

        case HORAS_EXTRAS.MANANA_12:

            return "Mañana 12h";


        case HORAS_EXTRAS.NOCHE_12:

            return "Noche 12h";


        case HORAS_EXTRAS.MANANA_8:

            return "Mañana 8h";


        case HORAS_EXTRAS.TARDE_8:

            return "Tarde 8h";


        case HORAS_EXTRAS.NOCHE_8:

            return "Noche 8h";


        case HORAS_EXTRAS.PLAYA:

            return "Playa";


        default:

            return "";

    }

}


/* ============================================================
   OBTENER TURNO PRINCIPAL ASOCIADO A UNA HORA EXTRA
============================================================ */

function obtenerTurnoAsociadoHoraExtra(turno) {

    const codigo =
        String(turno).trim();

    switch (codigo) {

        case HORAS_EXTRAS.MANANA_12:

        case HORAS_EXTRAS.MANANA_8:

        case HORAS_EXTRAS.TARDE_8:

            return TURNOS.MANANA;


        case HORAS_EXTRAS.NOCHE_12:

        case HORAS_EXTRAS.NOCHE_8:

            return TURNOS.NOCHE;


        case HORAS_EXTRAS.PLAYA:

            return TURNOS.PLAYA;


        default:

            return "";

    }

}


/* ============================================================
   OBTENER ELEMENTO DEL DOM
============================================================ */

function obtenerElemento(id) {

    return document.getElementById(id);

}


/* ============================================================
   MOSTRAR ELEMENTO
============================================================ */

function mostrarElemento(elemento) {

    if (!elemento) {

        return;

    }

    elemento.classList.remove("hidden");

}


/* ============================================================
   OCULTAR ELEMENTO
============================================================ */

function ocultarElemento(elemento) {

    if (!elemento) {

        return;

    }

    elemento.classList.add("hidden");

}


/* ============================================================
   MOSTRAR / OCULTAR POR ID
============================================================ */

function mostrarPorId(id) {

    mostrarElemento(
        obtenerElemento(id)
    );

}


function ocultarPorId(id) {

    ocultarElemento(
        obtenerElemento(id)
    );

}


/* ============================================================
   COMPROBAR SI UN ELEMENTO EXISTE
============================================================ */

function existeElemento(id) {

    return Boolean(
        obtenerElemento(id)
    );

}


/* ============================================================
   GUARDAR USUARIO EN EL DISPOSITIVO
============================================================ */

function guardarUsuarioLocal(usuario) {

    try {

        localStorage.setItem(

            STORAGE_KEYS.usuario,

            JSON.stringify(usuario)

        );

        localStorage.setItem(

            STORAGE_KEYS.autenticado,

            "true"

        );

    } catch (error) {

        console.error(
            "No se pudo guardar el usuario:",
            error
        );

    }

}


/* ============================================================
   RECUPERAR USUARIO DEL DISPOSITIVO
============================================================ */

function recuperarUsuarioLocal() {

    try {

        const datos =
            localStorage.getItem(
                STORAGE_KEYS.usuario
            );

        if (!datos) {

            return null;

        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "No se pudo recuperar el usuario:",
            error
        );

        return null;

    }

}


/* ============================================================
   COMPROBAR SESIÓN GUARDADA
============================================================ */

function existeSesionGuardada() {

    const autenticado =
        localStorage.getItem(
            STORAGE_KEYS.autenticado
        );

    return autenticado === "true";

}


/* ============================================================
   ELIMINAR SESIÓN
============================================================ */

function eliminarSesionLocal() {

    try {

        localStorage.removeItem(
            STORAGE_KEYS.usuario
        );

        localStorage.removeItem(
            STORAGE_KEYS.autenticado
        );

    } catch (error) {

        console.error(
            "No se pudo eliminar la sesión:",
            error
        );

    }

}


/* ============================================================
   ESCAPAR HTML
============================================================ */

function escaparHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }

    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   OBTENER HOY
============================================================ */

function establecerFechaHoy() {

    const fecha =
        obtenerFechaActual();

    const selectorDia =
        obtenerElemento("dia");

    const selectorMes =
        obtenerElemento("mes");

    if (selectorDia) {

        selectorDia.value =
            fecha.dia;

    }

    if (selectorMes) {

        selectorMes.value =
            fecha.mes;

    }

}


/* ============================================================
   GENERAR IDENTIFICADOR SEGURO PARA HTML
============================================================ */

function generarId(elemento) {

    return String(elemento || "")

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^a-zA-Z0-9]/g,
            "-"
        )

        .toLowerCase();

}


/* ============================================================
   FIN DE FUNCIONES AUXILIARES
============================================================ */