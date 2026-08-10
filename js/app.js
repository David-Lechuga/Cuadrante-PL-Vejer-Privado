/* ============================================================
   CUADRANTE POLICÍA LOCAL VEJER
   APP PRINCIPAL
   Versión privada 2.0
============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    console.log(
        "Iniciando Cuadrante Policía Local Vejer..."
    );

    try {

        /*
         * 1. Cargar los datos
         */

        if (
            typeof cargarDatosOnline === "function"
        ) {

            await cargarDatosOnline();

        } else {

            console.error(
                "No existe cargarDatosOnline()."
            );

        }


        /*
         * 2. Inicializar autenticación
         */

        if (
            typeof inicializarAutenticacion === "function"
        ) {

            inicializarAutenticacion();

        }


        /*
         * 3. Inicializar interfaz
         */

        inicializarInterfaz();


        /*
         * 4. Mostrar día actual
         */

        if (
            typeof irAHoy === "function"
        ) {

            irAHoy();

        }


        /*
         * 5. Registrar Service Worker
         */

        registrarServiceWorker();


        console.log(
            "Aplicación iniciada correctamente."
        );

    } catch (error) {

        console.error(
            "Error al iniciar la aplicación:",
            error
        );

        mostrarErrorInicio(
            error
        );

    }

});


/* ============================================================
   INICIALIZAR INTERFAZ
============================================================ */

function inicializarInterfaz() {

    /*
     * Selector de día
     */

    const selectorDia =
        document.getElementById(
            "dia"
        );


    if (selectorDia) {

        selectorDia.innerHTML = "";


        for (
            let dia = 1;
            dia <= 31;
            dia++
        ) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                dia;

            opcion.textContent =
                dia;

            selectorDia.appendChild(
                opcion
            );

        }

    }


    /*
     * Selector de mes
     *
     * Si el HTML ya contiene las opciones,
     * no las duplicamos.
     */

    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (
        selectorMes &&
        selectorMes.options.length === 0
    ) {

        const meses = [

            "ENERO",
            "FEBRERO",
            "MARZO",
            "ABRIL",
            "MAYO",
            "JUNIO",
            "JULIO",
            "AGOSTO",
            "SEPTIEMBRE",
            "OCTUBRE",
            "NOVIEMBRE",
            "DICIEMBRE"

        ];


        meses.forEach(
            (
                nombre,
                indice
            ) => {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    indice + 1;

                opcion.textContent =
                    nombre;

                selectorMes.appendChild(
                    opcion
                );

            }
        );

    }


    /*
     * Eventos de búsqueda
     */

    if (selectorDia) {

        selectorDia.addEventListener(
            "change",
            () => {

                if (
                    typeof buscarTurnos ===
                    "function"
                ) {

                    buscarTurnos();

                }

            }
        );

    }


    if (selectorMes) {

        selectorMes.addEventListener(
            "change",
            () => {

                if (
                    typeof buscarTurnos ===
                    "function"
                ) {

                    buscarTurnos();

                }

            }
        );

    }


    /*
     * Botón buscar
     */

    const botonBuscar =
        document.getElementById(
            "buscar"
        );


    if (botonBuscar) {

        botonBuscar.addEventListener(
            "click",
            () => {

                if (
                    typeof buscarTurnos ===
                    "function"
                ) {

                    buscarTurnos();

                }

            }
        );

    }


    /*
     * Botón de ajustes
     */

    const botonAjustes =
        document.getElementById(
            "btnAjustes"
        );


    if (botonAjustes) {

        botonAjustes.addEventListener(
            "click",
            () => {

                if (
                    typeof mostrarMenuAjustes ===
                    "function"
                ) {

                    mostrarMenuAjustes();

                }

            }
        );

    }


    /*
     * Compatibilidad con posibles botones
     * que utilicen otros IDs.
     */

    const posiblesAjustes = [

        "ajustes",
        "botonAjustes",
        "btn-ajustes"

    ];


    posiblesAjustes.forEach(
        id => {

            const elemento =
                document.getElementById(
                    id
                );


            if (
                elemento &&
                elemento !== botonAjustes
            ) {

                elemento.addEventListener(
                    "click",
                    () => {

                        if (
                            typeof mostrarMenuAjustes ===
                            "function"
                        ) {

                            mostrarMenuAjustes();

                        }

                    }
                );

            }

        }
    );

}


/* ============================================================
   REGISTRAR SERVICE WORKER
============================================================ */

function registrarServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    navigator.serviceWorker
        .register(
            "service-worker.js"
        )
        .then(
            registro => {

                console.log(
                    "Service Worker registrado:",
                    registro.scope
                );

            }
        )
        .catch(
            error => {

                console.warn(
                    "No se pudo registrar el Service Worker:",
                    error
                );

            }
        );

}


/* ============================================================
   ERROR DE INICIO
============================================================ */

function mostrarErrorInicio(
    error
) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) {

        return;

    }


    resultado.innerHTML = `

        <div class="
            bg-red-100
            border
            border-red-300
            text-red-700
            rounded-xl
            p-5
            text-center
        ">

            <div class="text-3xl mb-2">
                ⚠️
            </div>

            <h3 class="
                font-bold
                text-lg
                mb-2
            ">

                Error al iniciar la aplicación

            </h3>

            <p class="text-sm">

                ${escaparHTML(
                    error?.message ||
                    "Se ha producido un error inesperado."
                )}

            </p>

        </div>

    `;

}


/* ============================================================
   COMPATIBILIDAD — VALIDAR ACCESO
============================================================ */

/*
 * El HTML antiguo utilizaba:
 *
 *     validarAcceso()
 *
 * La nueva aplicación utiliza auth.js.
 *
 * Conservamos esta función para que no se rompa
 * ningún botón existente del index.html.
 */

function validarAcceso() {

    if (
        typeof iniciarSesion ===
        "function"
    ) {

        const campo =
            document.getElementById(
                "password"
            );


        const password =
            campo
                ? campo.value
                : "";


        iniciarSesion(
            password
        );

        return;

    }


    console.error(
        "No existe iniciarSesion()."
    );

}


/* ============================================================
   COMPATIBILIDAD — AJUSTES
============================================================ */

function abrirAjustes() {

    if (
        typeof mostrarMenuAjustes ===
        "function"
    ) {

        mostrarMenuAjustes();

    }

}


/* ============================================================
   COMPATIBILIDAD — INFORMACIÓN
============================================================ */

function abrirInformacion() {

    if (
        typeof mostrarInformacion ===
        "function"
    ) {

        mostrarInformacion();

    }

}


/* ============================================================
   COMPATIBILIDAD — CAMBIAR AGENTE
============================================================ */

function cambiarAgente() {

    if (
        typeof mostrarSelectorUsuarios ===
        "function"
    ) {

        mostrarSelectorUsuarios();

    }

}


/* ============================================================
   COMPATIBILIDAD — CERRAR SESIÓN
============================================================ */

function salir() {

    if (
        typeof cerrarSesion ===
        "function"
    ) {

        cerrarSesion();

    }

}


/* ============================================================
   FIN DE app.js
============================================================ */