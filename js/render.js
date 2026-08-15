/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   RENDERIZADO DE LA INTERFAZ
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   CREAR CAJA DE AGENTES
============================================================ */

function crearCaja(
    titulo,
    lista,
    turnoCodigo,
    fecha
) {

    const agentes =
        Array.isArray(lista)
            ? lista
            : [];


    let contenido =
        "";


    if (!agentes.length) {

        contenido = `
            <div class="text-center
                        text-gray-500
                        italic
                        py-6">

                ${TEXTOS.sinAgentes}

            </div>
        `;

    } else {

        contenido =
            agentes
                .map(
                    item =>
                        crearElementoAgente(
                            item,
                            turnoCodigo,
                            fecha
                        )
                )
                .join("");

    }


    return `

        <div class="tarjeta">

            <h3 class="text-2xl
                       font-bold
                       mb-4
                       text-center
                       text-[#0A2342]">

                ${titulo}

            </h3>

            <div class="space-y-2">

                ${contenido}

            </div>

        </div>

    `;

}


/* ============================================================
   CREAR ELEMENTO DE AGENTE
============================================================ */

function crearElementoAgente(
    item,
    turnoCodigo,
    fecha
) {

    /*
       Admitimos tanto un registro completo:

       {
           agente: "...",
           turno: "M"
       }

       como un simple nombre.

       Esto facilita la compatibilidad entre las
       diferentes funciones de búsqueda.
    */

    let nombre = "";
    let turno = turnoCodigo || "";


    if (
        item &&
        typeof item === "object"
    ) {

        nombre =
            item.agente || "";

        turno =
            item.turno ||
            turnoCodigo ||
            "";

    } else {

        nombre =
            item || "";

    }


    nombre =
        String(nombre).trim();


    turno =
        String(turno).trim();


    if (!nombre) {

        return "";

    }


    return `

        <div
            class="agent-item
                   bg-gray-50
                   hover:bg-gray-100
                   border
                   border-gray-200
                   rounded-xl
                   px-4
                   py-3
                   cursor-pointer
                   transition
                   flex
                   items-center
                   justify-between
                   gap-3"
            data-nombre="${escaparHTML(nombre)}"
            data-turno="${escaparHTML(turno)}"
            data-fecha="${escaparHTML(fecha || "")}"
        >

            <span class="font-semibold text-gray-800">

                ${escaparHTML(nombre)}

            </span>

            <span class="text-sm
                         text-gray-500
                         font-medium">

                ${escaparHTML(turno)}

            </span>

        </div>

    `;

}


/* ============================================================
   RENDERIZAR CUADRANTE COMPLETO — ADMINISTRADOR
============================================================ */

function renderizarTurnosAdministrador(
    dia,
    mesNumero,
    nombreMes,
    datos
) {

    const resultado =
        obtenerElemento(
            "resultado"
        );


    if (!resultado) {

        return;

    }


    const fecha =
        obtenerFechaModal(
            dia,
            nombreMes
        );


    const refuerzoManana =
        calcularRefuerzoManana(
            datos
        );


    const refuerzoNoche =
        calcularRefuerzoNoche(
            datos
        );


    /*
       Añadimos el texto de refuerzo a las cajas
       de mañana y noche, manteniendo el
       comportamiento de la aplicación original.
    */

    const manana =
        [...datos.manana];


    const noche =
        [...datos.noche];


    if (
        refuerzoManana > 0
    ) {

        manana.push({

            agente:
                refuerzoManana === 1
                    ? "+1 agente de horas extras"
                    : `+${refuerzoManana} agentes de horas extras`,

            turno:
                ""

        });

    }


    if (
        refuerzoNoche > 0
    ) {

        noche.push({

            agente:
                refuerzoNoche === 1
                    ? "+1 agente de horas extras"
                    : `+${refuerzoNoche} agentes de horas extras`,

            turno:
                ""

        });

    }


    /*
       Construimos las cajas de horas extras.
    */

    let cajasExtras =
        "";


    if (
        datos.extraHM.length
    ) {

        cajasExtras +=
            crearCaja(
                "Mañana 12h",
                datos.extraHM,
                HORAS_EXTRAS.MANANA_12,
                fecha
            );

    }


    if (
        datos.extraHN.length
    ) {

        cajasExtras +=
            crearCaja(
                "Noche 12h",
                datos.extraHN,
                HORAS_EXTRAS.NOCHE_12,
                fecha
            );

    }


    if (
        datos.extraHm.length
    ) {

        cajasExtras +=
            crearCaja(
                "Mañana 8h",
                datos.extraHm,
                HORAS_EXTRAS.MANANA_8,
                fecha
            );

    }


    if (
        datos.extraHt.length
    ) {

        cajasExtras +=
            crearCaja(
                "Tarde 8h",
                datos.extraHt,
                HORAS_EXTRAS.TARDE_8,
                fecha
            );

    }


    if (
        datos.extraHn.length
    ) {

        cajasExtras +=
            crearCaja(
                "Noche 8h",
                datos.extraHn,
                HORAS_EXTRAS.NOCHE_8,
                fecha
            );

    }


    if (
        datos.extraHPL.length
    ) {

        cajasExtras +=
            crearCaja(
                "Playa",
                datos.extraHPL,
                HORAS_EXTRAS.PLAYA,
                fecha
            );

    }


    const hayExtras =
        Boolean(
            cajasExtras
        );


    /*
       Construimos la pantalla.
    */

    resultado.innerHTML = `

        <h2 class="text-3xl
                   font-bold
                   mb-6
                   text-[#0A2342]">

            Turnos del ${escaparHTML(
                String(dia)
            )}
            de
            ${escaparHTML(
                nombreMes
            )}

        </h2>


        <div class="grid
                    md:grid-cols-2
                    gap-4">

            ${crearCaja(
                "🌞 Mañana",
                manana,
                TURNOS.MANANA,
                fecha
            )}

            ${crearCaja(
                "🌙 Noche",
                noche,
                TURNOS.NOCHE,
                fecha
            )}

        </div>


        <div class="mt-6">

            <div class="tarjeta">

                <h3 class="text-2xl
                           font-bold
                           mb-6
                           text-center
                           text-[#0A2342]">

                    SERVICIOS EXTRAORDINARIOS

                </h3>


                ${
                    hayExtras

                        ? `

                            <div class="grid
                                        md:grid-cols-3
                                        gap-4">

                                ${cajasExtras}

                            </div>

                          `

                        : `

                            <div class="text-center
                                        text-gray-500
                                        italic
                                        py-6">

                                ${TEXTOS.sinAgentes}

                            </div>

                          `
                }

            </div>

        </div>


        <div class="grid
                    md:grid-cols-2
                    gap-4
                    mt-6">

            ${crearCaja(
                "🏖️ Playa",
                datos.playa,
                TURNOS.PLAYA,
                fecha
            )}

            ${crearCaja(
                "🏝️ Vacaciones",
                datos.vacaciones,
                ESTADOS_NO_OPERATIVOS.VACACIONES,
                fecha
            )}

        </div>

    `;


    activarEventosAgentes();

}


/* ============================================================
   RENDERIZAR VISTA PRIVADA DEL AGENTE
============================================================ */

function renderizarTurnosAgente(
    dia,
    mesNumero,
    nombreMes,
    registroAgente,
    datos
) {

    const resultado =
        obtenerElemento(
            "resultado"
        );


    if (!resultado) {

        return;

    }


    const fecha =
        obtenerFechaModal(
            dia,
            nombreMes
        );


    const turnoAgente =
        String(
            registroAgente.turno || ""
        ).trim();


    const nombreAgente =
        registroAgente.agente ||
        obtenerNombreUsuarioActual();


    /*
       Refuerzos.
    */

    const refuerzoManana =
        calcularRefuerzoManana(
            datos
        );


    const refuerzoNoche =
        calcularRefuerzoNoche(
            datos
        );


    /*
       Para un agente solo mostramos el refuerzo
       relacionado con su propio turno.
    */

    const manana =
        [...datos.manana];


    const noche =
        [...datos.noche];


    if (
        turnoAgente === TURNOS.MANANA &&
        refuerzoManana > 0
    ) {

        manana.push({

            agente:
                refuerzoManana === 1
                    ? "+1 agente de horas extras"
                    : `+${refuerzoManana} agentes de horas extras`,

            turno:
                ""

        });

    }


    if (
        turnoAgente === TURNOS.NOCHE &&
        refuerzoNoche > 0
    ) {

        noche.push({

            agente:
                refuerzoNoche === 1
                    ? "+1 agente de horas extras"
                    : `+${refuerzoNoche} agentes de horas extras`,

            turno:
                ""

        });

    }


    /*
       Construimos horas extras.
    */

    let cajasExtras =
        "";


    if (
        datos.extraHM.length
    ) {

        cajasExtras +=
            crearCaja(
                "Mañana 12h",
                datos.extraHM,
                HORAS_EXTRAS.MANANA_12,
                fecha
            );

    }


    if (
        datos.extraHN.length
    ) {

        cajasExtras +=
            crearCaja(
                "Noche 12h",
                datos.extraHN,
                HORAS_EXTRAS.NOCHE_12,
                fecha
            );

    }


    if (
        datos.extraHm.length
    ) {

        cajasExtras +=
            crearCaja(
                "Mañana 8h",
                datos.extraHm,
                HORAS_EXTRAS.MANANA_8,
                fecha
            );

    }


    if (
        datos.extraHt.length
    ) {

        cajasExtras +=
            crearCaja(
                "Tarde 8h",
                datos.extraHt,
                HORAS_EXTRAS.TARDE_8,
                fecha
            );

    }


    if (
        datos.extraHn.length
    ) {

        cajasExtras +=
            crearCaja(
                "Noche 8h",
                datos.extraHn,
                HORAS_EXTRAS.NOCHE_8,
                fecha
            );

    }


    if (
        datos.extraHPL.length
    ) {

        cajasExtras +=
            crearCaja(
                "Playa",
                datos.extraHPL,
                HORAS_EXTRAS.PLAYA,
                fecha
            );

    }


    /*
       Si el agente está en M, N o PL mostramos
       únicamente su turno.
    */

    let cajaPrincipal =
    "";


/*
 * ------------------------------------------------------------
 * GRUPO MAÑANA
 * ------------------------------------------------------------
 *
 * M
 * CM
 * HM
 * Hm
 * Ht
 *
 * Todos pertenecen al mismo grupo operativo de mañana.
 */

const esGrupoManana =
    turnoAgente === TURNOS.MANANA ||
    turnoAgente === "CM" ||
    turnoAgente === HORAS_EXTRAS.MANANA_12 ||
    turnoAgente === HORAS_EXTRAS.MANANA_8 ||
    turnoAgente === HORAS_EXTRAS.TARDE_8;


/*
 * ------------------------------------------------------------
 * GRUPO NOCHE
 * ------------------------------------------------------------
 *
 * N
 * CN
 * HN
 * Hn
 *
 * Todos pertenecen al mismo grupo operativo de noche.
 */

const esGrupoNoche =
    turnoAgente === TURNOS.NOCHE ||
    turnoAgente === "CN" ||
    turnoAgente === HORAS_EXTRAS.NOCHE_12 ||
    turnoAgente === HORAS_EXTRAS.NOCHE_8;


/*
 * ------------------------------------------------------------
 * GRUPO PLAYA
 * ------------------------------------------------------------
 *
 * PL
 * HPL
 */

const esGrupoPlaya =
    turnoAgente === TURNOS.PLAYA ||
    turnoAgente === HORAS_EXTRAS.PLAYA;


/*
 * ------------------------------------------------------------
 * CAJA PRINCIPAL
 * ------------------------------------------------------------
 */

if (
    esGrupoManana
) {

    cajaPrincipal =
        crearCaja(
            "🌞 Mañana",
            manana,
            TURNOS.MANANA,
            fecha
        );

}


if (
    esGrupoNoche
) {

    cajaPrincipal =
        crearCaja(
            "🌙 Noche",
            noche,
            TURNOS.NOCHE,
            fecha
        );

}


if (
    esGrupoPlaya
) {

    cajaPrincipal =
        crearCaja(
            "🏖️ Playa",
            datos.playa,
            TURNOS.PLAYA,
            fecha
        );

}


    resultado.innerHTML = `

        <h2 class="text-3xl
                   font-bold
                   mb-2
                   text-[#0A2342]">

            ${escaparHTML(
                String(dia)
            )}
            de
            ${escaparHTML(
                nombreMes
            )}

        </h2>


        <p class="text-gray-600
                  mb-6">

            Servicio de
            <strong>
                ${escaparHTML(
                    nombreAgente
                )}
            </strong>

        </p>


        ${cajaPrincipal}


        ${
            cajasExtras

                ? `

                    <div class="mt-6">

                        <div class="tarjeta">

                            <h3 class="text-2xl
                                       font-bold
                                       mb-6
                                       text-center
                                       text-[#0A2342]">

                                SERVICIOS EXTRAORDINARIOS

                            </h3>


                            <div class="grid
                                        md:grid-cols-3
                                        gap-4">

                                ${cajasExtras}

                            </div>

                        </div>

                    </div>

                  `

                : ""
        }

    `;


    activarEventosAgentes();

}


/* ============================================================
   RENDERIZAR ESTADO NO OPERATIVO
============================================================ */

function renderizarEstadoNoOperativo(
    dia,
    mesNumero,
    nombreMes,
    nombreAgente,
    turno
) {

    const resultado =
        obtenerElemento(
            "resultado"
        );


    if (!resultado) {

        return;

    }


    const fecha =
        obtenerFechaModal(
            dia,
            nombreMes
        );


    const nombreEstado =
        obtenerNombreEstado(
            turno
        );


    resultado.innerHTML = `

        <h2 class="text-3xl
                   font-bold
                   mb-6
                   text-[#0A2342]">

            ${escaparHTML(
                String(dia)
            )}
            de
            ${escaparHTML(
                nombreMes
            )}

        </h2>


        <div class="tarjeta
                    text-center
                    py-8">

            <div class="text-5xl mb-4">

                📋

            </div>


            <h3 class="text-2xl
                       font-bold
                       text-[#0A2342]
                       mb-3">

                ${escaparHTML(
                    nombreEstado
                )}

            </h3>


            <p class="text-gray-600">

                ${escaparHTML(
                    nombreAgente
                )}

            </p>


        </div>

    `;

}


/* ============================================================
   OBTENER NOMBRE DE ESTADO
============================================================ */

function obtenerNombreEstado(
    turno
) {

    const codigo =
        String(
            turno || ""
        ).trim();


    switch (codigo) {

        case ESTADOS_NO_OPERATIVOS.DESCANSO:

            return "DESCANSO";


        case ESTADOS_NO_OPERATIVOS.LIBRE_DISPOSICION:

            return "LIBRE DISPOSICIÓN";


        case ESTADOS_NO_OPERATIVOS.HORAS_SINDICALES:

            return "HORAS SINDICALES";


        case ESTADOS_NO_OPERATIVOS.HORAS_PARTICULARES:

            return "HORAS DE PREVENCIÓN";


        case ESTADOS_NO_OPERATIVOS.HUELGA_JORNADA:

            return "HUELGA";


        case ESTADOS_NO_OPERATIVOS.BAJA:

            return "BAJA";


        case ESTADOS_NO_OPERATIVOS.ASUNTOS_FAMILIARES:

            return "ASUNTOS FAMILIARES";


        case ESTADOS_NO_OPERATIVOS.VACACIONES:

            return "VACACIONES";


        default:

            return codigo || "SIN SERVICIO";

    }

}


/* ============================================================
   RENDERIZAR SIN SERVICIO
============================================================ */

function renderizarSinServicio(
    dia,
    mesNumero,
    nombreMes,
    nombreAgente
) {

    const resultado =
        obtenerElemento(
            "resultado"
        );


    if (!resultado) {

        return;

    }


    resultado.innerHTML = `

        <h2 class="text-3xl
                   font-bold
                   mb-6
                   text-[#0A2342]">

            ${escaparHTML(
                String(dia)
            )}
            de
            ${escaparHTML(
                nombreMes
            )}

        </h2>


        <div class="tarjeta
                    text-center
                    py-8">

            <div class="text-5xl mb-4">

                ℹ️

            </div>


            <h3 class="text-2xl
                       font-bold
                       text-[#0A2342]
                       mb-3">

                SIN SERVICIO

            </h3>


            <p class="text-gray-600">

                ${escaparHTML(
                    nombreAgente
                )}

            </p>


        </div>

    `;

}


/* ============================================================
   ACTIVAR EVENTOS SOBRE AGENTES
============================================================ */

function activarEventosAgentes() {

    const elementos =
        document.querySelectorAll(
            ".agent-item"
        );


    let touchHandled =
        false;


    elementos.forEach(
        elemento => {

            const abrir =
                () => {

                    if (
                        touchHandled
                    ) {

                        return;

                    }


                    const nombre =
                        elemento.getAttribute(
                            "data-nombre"
                        ) || "";


                    const turno =
                        elemento.getAttribute(
                            "data-turno"
                        ) || "";


                    const fecha =
                        elemento.getAttribute(
                            "data-fecha"
                        ) || "";


                    /*
                       Las filas de "+X agentes..."
                       no deben abrir modal.
                    */

                    if (
                        nombre.startsWith("+")
                    ) {

                        return;

                    }


                    abrirMenuAgente(
                        nombre,
                        turno,
                        fecha
                    );

                };


            /*
               CLICK
            */

            elemento.addEventListener(
                "click",
                event => {

                    if (
                        event.detail === 0
                    ) {

                        return;

                    }

                    abrir();

                },
                {
                    passive: true
                }
            );


            /*
               TOUCH
            */

            elemento.addEventListener(
                "touchend",
                event => {

                    if (
                        event.cancelable
                    ) {

                        event.preventDefault();

                    }


                    touchHandled =
                        true;


                    abrir();


                    setTimeout(
                        () => {

                            touchHandled =
                                false;

                        },
                        300
                    );

                },
                {
                    passive: false
                }
            );


            /*
               POINTER
            */

            elemento.addEventListener(
                "pointerup",
                event => {

                    if (
                        event.pointerType ===
                        "touch"
                    ) {

                        if (
                            event.cancelable
                        ) {

                            event.preventDefault();

                        }


                        abrir();

                    }

                },
                {
                    passive: false
                }
            );

        }
    );

}


/* ============================================================
   FIN DE render.js
============================================================ */