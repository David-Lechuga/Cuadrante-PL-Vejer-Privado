/* ============================================================
   APP.JS
   CUADRANTE POLICÍA LOCAL VEJER
   ARCHIVO PRINCIPAL
============================================================ */

console.log(
    "Iniciando Cuadrante Policía Local Vejer..."
);


/* ============================================================
   INICIALIZACIÓN DE LA APLICACIÓN
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "DOM cargado."
        );


        /*
         * --------------------------------------------------------
         * 1. CARGAR TODOS LOS DATOS
         * --------------------------------------------------------
         *
         * data.js proporciona:
         *
         * cargarTodosLosDatos()
         *
         * No utilizamos cargarDatosOnline(), porque esa función
         * ya no pertenece a la nueva estructura.
         */

        try {

            if (
                typeof cargarTodosLosDatos ===
                "function"
            ) {

                await cargarTodosLosDatos();

                console.log(
                    "Datos cargados correctamente."
                );

            } else {

                console.error(
                    "No existe cargarTodosLosDatos()."
                );

            }

        } catch (error) {

            console.error(
                "Error cargando los datos:",
                error
            );

        }


        /*
         * --------------------------------------------------------
         * 2. INICIALIZAR AUTENTICACIÓN
         * --------------------------------------------------------
         */

        try {

            if (
                typeof inicializarAutenticacion ===
                "function"
            ) {

                await inicializarAutenticacion();

                console.log(
                    "Autenticación inicializada."
                );

            } else {

                console.error(
                    "No existe inicializarAutenticacion()."
                );

            }

        } catch (error) {

            console.error(
                "Error inicializando autenticación:",
                error
            );

        }


        /*
         * --------------------------------------------------------
         * 3. INICIALIZAR INTERFAZ
         * --------------------------------------------------------
         */

        try {

            inicializarInterfaz();

        } catch (error) {

            console.error(
                "Error inicializando la interfaz:",
                error
            );

        }


        /*
         * --------------------------------------------------------
         * 4. SERVICE WORKER
         * --------------------------------------------------------
         */

        registrarServiceWorker();


        console.log(
            "Aplicación iniciada correctamente."
        );

    }
);


/* ============================================================
   INICIALIZAR INTERFAZ
============================================================ */

function inicializarInterfaz() {

    console.log(
        "Inicializando interfaz..."
    );


    /*
     * --------------------------------------------------------
     * SELECTOR DE MES
     * --------------------------------------------------------
     */

    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (selectorMes) {

        /*
         * Si render.js/data.js ya ha rellenado el selector,
         * no hacemos nada.
         */

        if (
            selectorMes.options.length === 0 &&
            typeof obtenerMeses === "function"
        ) {

            const meses =
                obtenerMeses();


            meses.forEach(
                mes => {

                    const opcion =
                        document.createElement(
                            "option"
                        );

                    opcion.value =
                        mes;

                    opcion.textContent =
                        mes;

                    selectorMes.appendChild(
                        opcion
                    );

                }
            );

        }

    }


    /*
     * --------------------------------------------------------
     * SELECTOR DE DÍA
     * --------------------------------------------------------
     */

    const selectorDia =
        document.getElementById(
            "dia"
        );


    if (selectorDia) {

        if (
            selectorDia.options.length === 0
        ) {

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

    }


    /*
     * --------------------------------------------------------
     * BOTÓN BUSCAR
     * --------------------------------------------------------
     */

    const botonBuscar =
        document.getElementById(
            "btnBuscar"
        );


    if (
        botonBuscar &&
        typeof buscarTurnos ===
        "function"
    ) {

        botonBuscar.onclick =
            buscarTurnos;

    }


    /*
     * --------------------------------------------------------
     * BOTÓN HOY
     * --------------------------------------------------------
     */

    const botonHoy =
        document.getElementById(
            "btnHoy"
        );


    if (
        botonHoy &&
        typeof irAHoy ===
        "function"
    ) {

        botonHoy.onclick =
            irAHoy;

    }


    /*
     * --------------------------------------------------------
     * BOTÓN CERRAR SESIÓN
     * --------------------------------------------------------
     */

    const botonCerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );


    if (
        botonCerrarSesion &&
        typeof cerrarSesion ===
        "function"
    ) {

        botonCerrarSesion.onclick =
            cerrarSesion;

    }

}


/* ============================================================
   COMPATIBILIDAD
============================================================ */

/*
 * Esta función mantiene compatibilidad con cualquier parte
 * antigua de la aplicación que todavía pueda llamar a:
 *
 * cargarDatosOnline()
 *
 * La función REAL está ahora en data.js:
 *
 * cargarTodosLosDatos()
 */

async function cargarDatosOnline() {

    console.warn(
        "cargarDatosOnline() es una función de compatibilidad. " +
        "Usando cargarTodosLosDatos()."
    );


    if (
        typeof cargarTodosLosDatos ===
        "function"
    ) {

        return await cargarTodosLosDatos();

    }


    console.error(
        "No existe cargarTodosLosDatos()."
    );

}


/* ============================================================
   COMPATIBILIDAD CON LOGIN
============================================================ */

/*
 * IMPORTANTE:
 *
 * NO definimos aquí validarAcceso().
 *
 * La autenticación pertenece a auth.js.
 *
 * Tampoco definimos aquí iniciarSesion().
 *
 * auth.js es quien proporciona iniciarSesion().
 */


/* ============================================================
   IR AL DÍA ACTUAL
============================================================ */

function irAHoy() {

    const ahora =
        new Date();


    const dia =
        ahora.getDate();


    const mesNumero =
        ahora.getMonth();


    /*
     * Selector de día.
     */

    const selectorDia =
        document.getElementById(
            "dia"
        );


    if (selectorDia) {

        selectorDia.value =
            String(dia);

    }


    /*
     * Selector de mes.
     */

    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (selectorMes) {

        /*
         * Obtener nombre del mes desde data.js
         * si está disponible.
         */

        if (
            typeof obtenerMeses ===
            "function"
        ) {

            const meses =
                obtenerMeses();


            if (
                meses &&
                meses[mesNumero]
            ) {

                selectorMes.value =
                    meses[mesNumero];

            }

        }

    }


    /*
     * Buscar turnos.
     */

    if (
        typeof buscarTurnos ===
        "function"
    ) {

        buscarTurnos();

    }

}


/* ============================================================
   OBTENER FECHA SELECCIONADA
============================================================ */

function obtenerFechaSeleccionada() {

    const selectorDia =
        document.getElementById(
            "dia"
        );


    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (
        !selectorDia ||
        !selectorMes
    ) {

        return null;

    }


    return {

        dia:
            selectorDia.value,

        mes:
            selectorMes.value

    };

}


/* ============================================================
   INICIALIZAR DÍA Y MES
============================================================ */

function inicializarFechaActual() {

    const ahora =
        new Date();


    const selectorDia =
        document.getElementById(
            "dia"
        );


    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (selectorDia) {

        selectorDia.value =
            String(
                ahora.getDate()
            );

    }


    if (
        selectorMes &&
        typeof obtenerMeses ===
        "function"
    ) {

        const meses =
            obtenerMeses();


        const mes =
            meses[
                ahora.getMonth()
            ];


        if (mes) {

            selectorMes.value =
                mes;

        }

    }

}


/* ============================================================
   SERVICE WORKER
============================================================ */

function registrarServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {

        console.warn(
            "Este navegador no admite Service Worker."
        );

        return;

    }


    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
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

                        console.error(
                            "Error registrando Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}


/* ============================================================
   FIN APP.JS
============================================================ */

console.log(
    "app.js cargado correctamente."
);