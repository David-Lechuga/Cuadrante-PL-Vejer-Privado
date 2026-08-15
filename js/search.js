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
       Turnos operativos normales.

       M  + CM = grupo Mañana
       N  + CN = grupo Noche
       PL     = grupo Playa
    */

    if (
        esTurnoOperativo(
            turnoAgente
        ) ||
        turnoAgente === "CM" ||
        turnoAgente === "CN"
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


    /*
       Creamos primero la clasificación completa
       de los turnos del día.

       Mañana = M + CM
       Noche  = N + CN
       Playa  = PL
    */

    const datos =
        crearDatosTurnos(
            registrosDia
        );


    /*
       Determinamos a qué grupo pertenece el agente.
    */

    const esGrupoManana =
        turno === TURNOS.MANANA ||
        turno === "CM";


    const esGrupoNoche =
        turno === TURNOS.NOCHE ||
        turno === "CN";


    const esGrupoPlaya =
        turno === TURNOS.PLAYA;


    /*
       Para los turnos normales y CM/CN:

       - El cuadro principal contiene todos los
         compañeros del grupo correspondiente.
       - Las horas extras correspondientes al grupo
         también se muestran.
    */

    const datosPrivados = {

        manana:
            esGrupoManana
                ? datos.manana
                : [],


        noche:
            esGrupoNoche
                ? datos.noche
                : [],


        playa:
            esGrupoPlaya
                ? datos.playa
                : [],


        vacaciones: [],


        /*
         * MAÑANA
         *
         * M / CM / HM / Hm / Ht
         * comparten:
         *
         * HM + Hm + Ht
         */

        extraHM:
            esGrupoManana
                ? datos.extraHM
                : [],


        extraHm:
            esGrupoManana
                ? datos.extraHm
                : [],


        extraHt:
            esGrupoManana
                ? datos.extraHt
                : [],


        /*
         * NOCHE
         *
         * N / CN / HN / Hn
         * comparten:
         *
         * HN + Hn
         */

        extraHN:
            esGrupoNoche
                ? datos.extraHN
                : [],


        extraHn:
            esGrupoNoche
                ? datos.extraHn
                : [],


        /*
         * PLAYA
         *
         * PL / HPL
         */

        extraHPL:
            esGrupoPlaya
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


    /*
       Creamos la clasificación completa
       de los turnos del día.
    */

    const datos =
        crearDatosTurnos(
            registrosDia
        );


    /*
       Determinamos el grupo al que pertenece
       la hora extra.
    */

    const esGrupoManana =
        turnoExtra === HORAS_EXTRAS.MANANA_12 ||
        turnoExtra === HORAS_EXTRAS.MANANA_8 ||
        turnoExtra === HORAS_EXTRAS.TARDE_8;


    const esGrupoNoche =
        turnoExtra === HORAS_EXTRAS.NOCHE_12 ||
        turnoExtra === HORAS_EXTRAS.NOCHE_8;


    const esGrupoPlaya =
        turnoExtra === HORAS_EXTRAS.PLAYA;


    /*
       Cuando el agente está en una hora extra,
       también debe ver el turno ordinario asociado.

       Por ejemplo:

       HM → M + CM + HM + Hm + Ht

       Hm → M + CM + HM + Hm + Ht

       Ht → M + CM + HM + Hm + Ht

       HN → N + CN + HN + Hn

       Hn → N + CN + HN + Hn

       HPL → PL + HPL
    */

    const datosPrivados = {

        /*
         * GRUPO MAÑANA
         */

        manana:
            esGrupoManana
                ? datos.manana
                : [],


        /*
         * GRUPO NOCHE
         */

        noche:
            esGrupoNoche
                ? datos.noche
                : [],


        /*
         * GRUPO PLAYA
         */

        playa:
            esGrupoPlaya
                ? datos.playa
                : [],


        vacaciones: [],


        /*
         * HORAS EXTRAS MAÑANA
         *
         * Para cualquiera de:
         *
         * HM / Hm / Ht
         *
         * mostramos las tres categorías.
         */

        extraHM:
            esGrupoManana
                ? datos.extraHM
                : [],


        extraHm:
            esGrupoManana
                ? datos.extraHm
                : [],


        extraHt:
            esGrupoManana
                ? datos.extraHt
                : [],


        /*
         * HORAS EXTRAS NOCHE
         *
         * HN / Hn
         *
         * mostramos las dos categorías.
         */

        extraHN:
            esGrupoNoche
                ? datos.extraHN
                : [],


        extraHn:
            esGrupoNoche
                ? datos.extraHn
                : [],


        /*
         * HORAS EXTRAS PLAYA
         */

        extraHPL:
            esGrupoPlaya
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


                /*
                 * MAÑANA
                 *
                 * M + CM
                 */

                case TURNOS.MANANA:

                    datos.manana.push(
                        item
                    );

                    break;


                case "CM":

                    datos.manana.push(
                        item
                    );

                    break;


                /*
                 * NOCHE
                 *
                 * N + CN
                 */

                case TURNOS.NOCHE:

                    datos.noche.push(
                        item
                    );

                    break;


                case "CN":

                    datos.noche.push(
                        item
                    );

                    break;


                /*
                 * PLAYA
                 */

                case TURNOS.PLAYA:

                    datos.playa.push(
                        item
                    );

                    break;


                /*
                 * HORAS EXTRAS
                 */

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


                /*
                 * VACACIONES
                 */

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