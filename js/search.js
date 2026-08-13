/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   BÚSQUEDA Y FILTRADO DEL CUADRANTE
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   BÚSQUEDA PRINCIPAL
============================================================ */

function buscarTurnos() {

    /*
       Comprobamos que exista un usuario autenticado.
    */

    if (!usuarioAutenticado()) {

    return;

}


    const selectorDia =
        obtenerElemento("dia");

    const selectorMes =
        obtenerElemento("mes");


    if (
        !selectorDia ||
        !selectorMes
    ) {

        console.error(
            "No se encontraron los selectores de día y mes."
        );

        return;

    }


    const dia =
        parseInt(
            selectorDia.value
        );

    const mesNumero =
        parseInt(
            selectorMes.value
        );


    if (
        Number.isNaN(dia) ||
        Number.isNaN(mesNumero)
    ) {

        return;

    }


    const nombreMes =
        obtenerNombreMes(
            mesNumero
        );


    const datosMes =
        obtenerDatosMes(
            nombreMes
        );


    if (!datosMes.length) {

        mostrarErrorResultado(
            `No hay datos disponibles para ${nombreMes}.`
        );

        return;

    }


    /*
       ADMINISTRADOR
       --------------
       Ve el cuadrante completo.
    */

    if (esAdministrador()) {

        buscarTurnosAdministrador(
            dia,
            mesNumero,
            nombreMes,
            datosMes
        );

        return;

    }


    /*
       AGENTE
       ------
       Solo ve su propio servicio y
       los compañeros correspondientes.
    */

    if (esAgente()) {

        buscarTurnosAgente(
            dia,
            mesNumero,
            nombreMes,
            datosMes
        );

        return;

    }


    mostrarErrorResultado(
        "No se ha podido determinar el tipo de usuario."
    );

}


/* ============================================================
   BÚSQUEDA DEL ADMINISTRADOR
============================================================ */

function buscarTurnosAdministrador(
    dia,
    mesNumero,
    nombreMes,
    datosMes
) {

    const registrosDia =
        datosMes.filter(
            item =>
                parseInt(item.dia) === dia
        );


    const datos =
        crearDatosTurnos(
            registrosDia
        );


    renderizarTurnosAdministrador(
        dia,
        mesNumero,
        nombreMes,
        datos
    );

}


/* ============================================================
   BÚSQUEDA DEL AGENTE
============================================================ */

function buscarTurnosAgente(
    dia,
    mesNumero,
    nombreMes,
    datosMes
) {

    const nombreAgente =
        obtenerNombreUsuarioActual();


    const registrosDia =
        datosMes.filter(
            item =>
                parseInt(item.dia) === dia
        );


    /*
       Buscamos el registro correspondiente
       al agente identificado.
    */

    const registroAgente =
        registrosDia.find(
            item =>
                normalizarTexto(
                    item.agente
                ) ===
                normalizarTexto(
                    nombreAgente
                )
        );


    /*
       El agente existe en usuarios.json
       pero no tiene servicio registrado
       ese día.
    */

    if (!registroAgente) {

        renderizarSinServicio(
            dia,
            mesNumero,
            nombreMes,
            nombreAgente
        );

        return;

    }


    const turnoAgente =
        String(
            registroAgente.turno || ""
        ).trim();


    /*
       Estados no operativos:
       solo mostramos el estado del propio agente.
    */

    if (
        esEstadoNoOperativo(
            turnoAgente
        )
    ) {

        renderizarEstadoNoOperativo(
            dia,
            mesNumero,
            nombreMes,
            nombreAgente,
            turnoAgente
        );

        return;

    }


    /*
       Turno operativo:
       buscamos compañeros del mismo servicio.
    */

    if (
        esTurnoOperativo(
            turnoAgente
        )
    ) {

        buscarTurnoOperativoAgente(
            dia,
            mesNumero,
            nombreMes,
            registrosDia,
            registroAgente
        );

        return;

    }


    /*
       Si el agente tiene directamente una hora extra
       como servicio principal.
    */

    if (
        esHoraExtra(
            turnoAgente
        )
    ) {

        buscarHoraExtraAgente(
            dia,
            mesNumero,
            nombreMes,
            registrosDia,
            registroAgente
        );

        return;

    }


    /*
       Cualquier otro código desconocido se muestra
       únicamente al propio agente.
    */

    renderizarEstadoNoOperativo(
        dia,
        mesNumero,
        nombreMes,
        nombreAgente,
        turnoAgente
    );

}


/* ============================================================
   TURNO OPERATIVO DEL AGENTE
============================================================ */

function buscarTurnoOperativoAgente(
    dia,
    mesNumero,
    nombreMes,
    registrosDia,
    registroAgente
) {

    const turno =
        String(
            registroAgente.turno
        ).trim();


    const compañeros =
        registrosDia.filter(
            item =>
                String(
                    item.turno || ""
                ).trim() === turno
        );


    const datos =
        crearDatosTurnos(
            registrosDia
        );


    /*
       Sustituimos el listado general del turno
       por únicamente los compañeros del mismo turno.
    */

    const datosPrivados = {

        manana:
            turno === TURNOS.MANANA
                ? compañeros
                : [],

        noche:
            turno === TURNOS.NOCHE
                ? compañeros
                : [],

        playa:
            turno === TURNOS.PLAYA
                ? compañeros
                : [],

        vacaciones: [],

        extraHM:
            turno === TURNOS.MANANA
                ? datos.extraHM
                : [],

        extraHN:
            turno === TURNOS.NOCHE
                ? datos.extraHN
                : [],

        extraHm:
            turno === TURNOS.MANANA
                ? datos.extraHm
                : [],

        extraHt:
            turno === TURNOS.MANANA
                ? datos.extraHt
                : [],

        extraHn:
            turno === TURNOS.NOCHE
                ? datos.extraHn
                : [],

        extraHPL:
            turno === TURNOS.PLAYA
                ? datos.extraHPL
                : []

    };


    renderizarTurnosAgente(
        dia,
        mesNumero,
        nombreMes,
        registroAgente,
        datosPrivados
    );

}


/* ============================================================
   AGENTE CON SERVICIO DE HORA EXTRA
============================================================ */

function buscarHoraExtraAgente(
    dia,
    mesNumero,
    nombreMes,
    registrosDia,
    registroAgente
) {

    const turnoExtra =
        String(
            registroAgente.turno
        ).trim();


    const turnoPrincipal =
        obtenerTurnoAsociadoHoraExtra(
            turnoExtra
        );


    /*
       Los compañeros se buscan dentro de la misma
       categoría de hora extra.
    */

    const compañeros =
        registrosDia.filter(
            item =>
                String(
                    item.turno || ""
                ).trim() === turnoExtra
        );


    const datos =
        crearDatosTurnos(
            registrosDia
        );


    const datosPrivados = {

        manana:
            turnoPrincipal === TURNOS.MANANA
                ? compañeros
                : [],

        noche:
            turnoPrincipal === TURNOS.NOCHE
                ? compañeros
                : [],

        playa:
            turnoPrincipal === TURNOS.PLAYA
                ? compañeros
                : [],

        vacaciones: [],

        extraHM:
            turnoExtra === HORAS_EXTRAS.MANANA_12
                ? compañeros
                : [],

        extraHN:
            turnoExtra === HORAS_EXTRAS.NOCHE_12
                ? compañeros
                : [],

        extraHm:
            turnoExtra === HORAS_EXTRAS.MANANA_8
                ? compañeros
                : [],

        extraHt:
            turnoExtra === HORAS_EXTRAS.TARDE_8
                ? compañeros
                : [],

        extraHn:
            turnoExtra === HORAS_EXTRAS.NOCHE_8
                ? compañeros
                : [],

        extraHPL:
            turnoExtra === HORAS_EXTRAS.PLAYA
                ? compañeros
                : []

    };


    renderizarTurnosAgente(
        dia,
        mesNumero,
        nombreMes,
        registroAgente,
        datosPrivados
    );

}


/* ============================================================
   CREAR DATOS DE TODOS LOS TURNOS
============================================================ */

function crearDatosTurnos(
    registrosDia
) {

    const datos = {

        manana: [],

        noche: [],

        playa: [],

        vacaciones: [],

        extraHM: [],

        extraHN: [],

        extraHm: [],

        extraHt: [],

        extraHn: [],

        extraHPL: []

    };


    registrosDia.forEach(
        item => {

            const turno =
                String(
                    item.turno || ""
                ).trim();


            switch (turno) {

                case TURNOS.MANANA:

                    datos.manana.push(
                        item
                    );

                    break;


                case TURNOS.NOCHE:

                    datos.noche.push(
                        item
                    );

                    break;


                case TURNOS.PLAYA:

                    datos.playa.push(
                        item
                    );

                    break;


                case HORAS_EXTRAS.MANANA_12:

                    datos.extraHM.push(
                        item
                    );

                    break;


                case HORAS_EXTRAS.NOCHE_12:

                    datos.extraHN.push(
                        item
                    );

                    break;


                case HORAS_EXTRAS.MANANA_8:

                    datos.extraHm.push(
                        item
                    );

                    break;


                case HORAS_EXTRAS.TARDE_8:

                    datos.extraHt.push(
                        item
                    );

                    break;


                case HORAS_EXTRAS.NOCHE_8:

                    datos.extraHn.push(
                        item
                    );

                    break;


                case HORAS_EXTRAS.PLAYA:

                    datos.extraHPL.push(
                        item
                    );

                    break;


                case ESTADOS_NO_OPERATIVOS.VACACIONES:

                    datos.vacaciones.push(
                        item
                    );

                    break;

            }

        }
    );


    return datos;

}


/* ============================================================
   CALCULAR REFUERZOS DE MAÑANA
============================================================ */

function calcularRefuerzoManana(
    datos
) {

    return (

        datos.extraHM.length +

        datos.extraHm.length +

        datos.extraHt.length

    );

}


/* ============================================================
   CALCULAR REFUERZOS DE NOCHE
============================================================ */

function calcularRefuerzoNoche(
    datos
) {

    return (

        datos.extraHN.length +

        datos.extraHn.length

    );

}


/* ============================================================
   OBTENER FECHA PARA MODAL
============================================================ */

function obtenerFechaModal(
    dia,
    nombreMes
) {

    return `${dia} de ${nombreMes}`;

}


/* ============================================================
   MOSTRAR ERROR DE RESULTADO
============================================================ */

function mostrarErrorResultado(
    mensaje
) {

    const resultado =
        obtenerElemento(
            "resultado"
        );


    if (!resultado) {

        return;

    }


    resultado.innerHTML = `

        <div class="bg-red-100
                    text-red-700
                    p-4
                    rounded-xl
                    text-center
                    font-semibold">

            ${escaparHTML(mensaje)}

        </div>

    `;

}


/* ============================================================
   IR A HOY
============================================================ */

function irAHoy() {

    establecerFechaHoy();

    buscarTurnos();

}


/* ============================================================
   FIN DE search.js
============================================================ */