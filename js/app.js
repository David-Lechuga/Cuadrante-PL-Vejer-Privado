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


                /*
                 * ------------------------------------------------
                 * ESTABLECER FECHA ACTUAL
                 * ------------------------------------------------
                 *
                 * Los selectores de día y mes ya han sido
                 * rellenados por data.js, por lo que ahora
                 * podemos establecer correctamente la fecha
                 * actual.
                 */
                
                establecerFechaHoy();

                if (
                    typeof irAHoy ===
                    "function"
                ) {

                    irAHoy();

                }


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


    /* ========================================================
       SELECTOR DE DÍA
    ======================================================== */

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
                    String(dia);

                opcion.textContent =
                    String(dia);


                selectorDia.appendChild(
                    opcion
                );

            }

        }

    }


    /* ========================================================
       SELECTOR DE MES
    ======================================================== */

    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (selectorMes) {

        /*
         * IMPORTANTE:
         *
         * El buscador utiliza los valores:
         *
         * 1  = Enero
         * 2  = Febrero
         * ...
         * 12 = Diciembre
         *
         * Por eso el value es numérico y el texto
         * es el nombre del mes.
         */

        if (
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
                        String(
                            indice + 1
                        );


                    opcion.textContent =
                        nombre;


                    selectorMes.appendChild(
                        opcion
                    );

                }
            );

        }

    }


    /* ========================================================
       BOTÓN BUSCAR
    ======================================================== */

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


    /* ========================================================
       BOTÓN HOY
    ======================================================== */

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


    /* ========================================================
       BOTÓN DÍA SIGUIENTE
    ======================================================== */

    const botonDiaSiguiente =
        document.getElementById(
            "btnDiaSiguiente"
        );


    if (
        botonDiaSiguiente &&
        typeof diaSiguiente ===
        "function"
    ) {

        botonDiaSiguiente.onclick =
            diaSiguiente;

    }


    /* ========================================================
       CERRAR SESIÓN
    ======================================================== */

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


    /*
     * JavaScript devuelve:
     *
     * Enero = 0
     * Febrero = 1
     * ...
     * Diciembre = 11
     *
     * Nuestro selector utiliza:
     *
     * Enero = 1
     * ...
     * Diciembre = 12
     */

    const mes =
        ahora.getMonth() + 1;


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
            String(dia);

    }


    if (selectorMes) {

        selectorMes.value =
            String(mes);

    }


    console.log(
        `Fecha establecida en Hoy: ${dia}/${mes}`
    );


    /*
     * Buscar automáticamente el cuadrante.
     */

    if (
        typeof buscarTurnos ===
        "function"
    ) {

        buscarTurnos();

    }

}

/* ============================================================
   DÍA SIGUIENTE
============================================================ */

/*
 * Avanza exactamente un día respecto al día que se está
 * visualizando actualmente.
 *
 * Ejemplos:
 *
 * 15 agosto  → 16 agosto
 * 31 agosto  → 1 septiembre
 * 30 septiembre → 1 octubre
 * 31 diciembre → 1 enero
 *
 * Después de actualizar los selectores ejecuta automáticamente
 * buscarTurnos().
 */

function diaSiguiente() {

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

        console.error(
            "No se encontraron los selectores de día y mes."
        );

        return;

    }


    /* ========================================================
       OBTENER FECHA ACTUAL
    ======================================================== */

    let dia =
        parseInt(
            selectorDia.value,
            10
        );


    let mes =
        parseInt(
            selectorMes.value,
            10
        );


    /*
     * Si el día no es válido,
     * comenzamos en el día 1.
     */

    if (
        Number.isNaN(dia)
    ) {

        dia = 1;

    }


    /*
     * Si el mes no es válido,
     * utilizamos el mes actual.
     */

    if (
        Number.isNaN(mes) ||
        mes < 1 ||
        mes > 12
    ) {

        mes =
            new Date().getMonth() + 1;

    }


    /* ========================================================
       DÍAS DE CADA MES
    ======================================================== */

    const diasPorMes = [

        0,

        31, // Enero
        28, // Febrero
        31, // Marzo
        30, // Abril
        31, // Mayo
        30, // Junio
        31, // Julio
        31, // Agosto
        30, // Septiembre
        31, // Octubre
        30, // Noviembre
        31  // Diciembre

    ];


    /* ========================================================
       AVANZAR UN DÍA
    ======================================================== */

    dia++;


    /* ========================================================
       CAMBIO DE MES
    ======================================================== */

    if (
        dia >
        diasPorMes[mes]
    ) {

        dia = 1;

        mes++;

    }


    /*
     * Después de diciembre:
     *
     * 31 diciembre → 1 enero
     */

    if (
        mes > 12
    ) {

        mes = 1;

    }


    /* ========================================================
       ACTUALIZAR SELECTORES
    ======================================================== */

    selectorDia.value =
        String(dia);


    selectorMes.value =
        String(mes);


    console.log(
        `Día siguiente: ${dia}/${mes}`
    );


    /* ========================================================
       BUSCAR LOS TURNOS DEL NUEVO DÍA
    ======================================================== */

    if (
        typeof buscarTurnos ===
        "function"
    ) {

        buscarTurnos();

    } else {

        console.error(
            "No existe buscarTurnos()."
        );

    }

}


/* ============================================================
   UTILIDADES DE FECHA
============================================================ */

/*
 * Devuelve el nombre del mes correspondiente a un índice
 * de 0 a 11.
 */

function obtenerNombreMes(
    indice
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


    return meses[
        indice - 1
    ] || "";
}

/*
 * Devuelve el número de días del mes.
 */

function obtenerDiasDelMes(
    indiceMes
) {

    const dias = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];


    return dias[indiceMes] ||
        31;

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
        () => {

            navigator.serviceWorker
                .register(
                    "./sw.js"
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
   FUNCIONES DE INTERFAZ
============================================================ */

/*
 * Muestra u oculta un elemento.
 */

function alternarElemento(
    id
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        return;

    }


    elemento.classList.toggle(
        "hidden"
    );

}


/*
 * Oculta un elemento.
 */

function ocultarElemento(
    id
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.classList.add(
            "hidden"
        );

    }

}


/*
 * Muestra un elemento.
 */

function mostrarElemento(
    id
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.classList.remove(
            "hidden"
        );

    }

}


/* ============================================================
   CERRAR MODALES
============================================================ */

function cerrarTodosLosModales() {

    const selectores = [

        "#menuAjustes",

        "#selectorUsuarios",

        "#modalInformacion",

        "#modalAgente",

        "#modalTelefono",

        "#modalWhatsapp"

    ];


    selectores.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    elemento => {

                        elemento.remove();

                    }
                );

        }
    );

}


/* ============================================================
   MENSAJE DE ERROR
============================================================ */

function mostrarError(
    mensaje
) {

    console.error(
        mensaje
    );


    /*
     * Si existe un contenedor de mensajes,
     * lo utilizamos.
     */

    const contenedor =
        document.getElementById(
            "mensajeError"
        );


    if (
        contenedor
    ) {

        contenedor.textContent =
            mensaje;


        contenedor.classList.remove(
            "hidden"
        );


        return;

    }


    /*
     * Como último recurso utilizamos alert.
     */

    alert(
        mensaje
    );

}


/* ============================================================
   MENSAJE DE INFORMACIÓN
============================================================ */

function mostrarMensaje(
    mensaje
) {

    console.log(
        mensaje
    );


    const contenedor =
        document.getElementById(
            "mensajeInfo"
        );


    if (
        contenedor
    ) {

        contenedor.textContent =
            mensaje;


        contenedor.classList.remove(
            "hidden"
        );


        return;

    }

}


/* ============================================================
   FIN DE LA PARTE 2
============================================================ */
/* ============================================================
   FUNCIONES DE COMPATIBILIDAD
============================================================ */

/*
 * Algunas partes de la aplicación pueden necesitar conocer
 * si existe un usuario autenticado.
 */

function usuarioAutenticado() {

    if (
        typeof obtenerUsuarioActual ===
        "function"
    ) {

        return obtenerUsuarioActual();

    }


    return null;

}


/* ============================================================
   OBTENER NOMBRE DEL USUARIO ACTUAL
============================================================ */

function obtenerNombreUsuarioActualApp() {

    const usuario =
        usuarioAutenticado();


    if (!usuario) {

        return "";

    }


    return (
        usuario.nombre ||
        usuario.id ||
        ""
    );

}


/* ============================================================
   COMPROBAR SI EL USUARIO ES ADMINISTRADOR
============================================================ */

function esAdministradorApp() {

    const usuario =
        usuarioAutenticado();


    if (!usuario) {

        return false;

    }


    return (
        usuario.tipo ===
        "admin"
    );

}


/* ============================================================
   ACTUALIZAR INFORMACIÓN DEL USUARIO
============================================================ */

function actualizarInformacionUsuario() {

    const usuario =
        usuarioAutenticado();


    const elementos =
        document.querySelectorAll(
            "[data-usuario-actual]"
        );


    elementos.forEach(
        elemento => {

            if (usuario) {

                elemento.textContent =
                    usuario.nombre ||
                    usuario.id ||
                    "";

            } else {

                elemento.textContent =
                    "";

            }

        }
    );

}


/* ============================================================
   FUNCIÓN DE APOYO PARA RECARGAR EL DÍA ACTUAL
============================================================ */

function recargarTurnos() {

    if (
        typeof buscarTurnos ===
        "function"
    ) {

        buscarTurnos();

    } else {

        console.error(
            "No existe buscarTurnos()."
        );

    }

}


/* ============================================================
   CAMBIO DE MES
============================================================ */

function cambiarMes(
    incremento
) {

    const selectorMes =
        document.getElementById(
            "mes"
        );


    if (!selectorMes) {

        return;

    }


    const meses =
        typeof obtenerMeses ===
        "function"
            ? obtenerMeses()
            : [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ];


    let indice =
        meses.indexOf(
            selectorMes.value
        );


    if (
        indice < 0
    ) {

        indice = 0;

    }


    indice +=
        incremento;


    if (
        indice < 0
    ) {

        indice =
            meses.length - 1;

    }


    if (
        indice >=
        meses.length
    ) {

        indice = 0;

    }


    selectorMes.value =
        meses[indice];


    recargarTurnos();

}


/* ============================================================
   CAMBIO DE DÍA
============================================================ */

function cambiarDia(
    incremento
) {

    const selectorDia =
        document.getElementById(
            "dia"
        );


    if (!selectorDia) {

        return;

    }


    let dia =
        parseInt(
            selectorDia.value,
            10
        );


    if (
        Number.isNaN(
            dia
        )
    ) {

        dia = 1;

    }


    dia +=
        incremento;


    if (
        dia < 1
    ) {

        dia = 31;

    }


    if (
        dia > 31
    ) {

        dia = 1;

    }


    selectorDia.value =
        String(
            dia
        );


    recargarTurnos();

}


/* ============================================================
   VALIDAR SELECTORES
============================================================ */

function validarSelectores() {

    const dia =
        document.getElementById(
            "dia"
        );


    const mes =
        document.getElementById(
            "mes"
        );


    if (
        !dia ||
        !mes
    ) {

        return false;

    }


    return (
        dia.value !== "" &&
        mes.value !== ""
    );

}


/* ============================================================
   ACTUALIZAR FECHA MOSTRADA
============================================================ */

function actualizarFechaMostrada() {

    const dia =
        document.getElementById(
            "dia"
        );


    const mes =
        document.getElementById(
            "mes"
        );


    const destino =
        document.getElementById(
            "fechaSeleccionada"
        );


    if (
        !dia ||
        !mes ||
        !destino
    ) {

        return;

    }


    destino.textContent =
        `${dia.value} de ${mes.value}`;

}


/* ============================================================
   EVENTOS DE LOS SELECTORES
============================================================ */

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target &&
            (
                event.target.id ===
                "dia" ||
                event.target.id ===
                "mes"
            )
        ) {

            actualizarFechaMostrada();

        }

    }
);


/* ============================================================
   ATAJOS DE TECLADO
============================================================ */

/*
 * Los siguientes atajos permiten avanzar o retroceder
 * rápidamente cuando el usuario está trabajando con el
 * cuadrante.
 *
 * Flecha derecha → día siguiente
 * Flecha izquierda → día anterior
 *
 * Solo se aplican cuando no estamos escribiendo en un input.
 */

document.addEventListener(
    "keydown",
    function (event) {

        const elemento =
            event.target;


        const tag =
            elemento &&
            elemento.tagName
                ? elemento.tagName.toLowerCase()
                : "";


        if (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select"
        ) {

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            /*
             * No utilizamos cambiarDia()
             * porque Día siguiente también
             * necesita controlar el cambio
             * de mes.
             */

            diaSiguiente();

        }

    }
);


/* ============================================================
   PREPARAR FECHA INICIAL
============================================================ */

function prepararFechaInicial() {

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

        console.error(
            "No se encontraron los selectores de día y mes."
        );

        return;

    }


    /* ========================================================
       FECHA ACTUAL
    ======================================================== */

    const ahora =
        new Date();


    const dia =
        ahora.getDate();


    /*
     * JavaScript devuelve:
     *
     * Enero = 0
     * Febrero = 1
     * ...
     * Diciembre = 11
     *
     * Nuestro selector utiliza:
     *
     * Enero = 1
     * ...
     * Diciembre = 12
     */

    const mes =
        ahora.getMonth() + 1;


    /* ========================================================
       ESTABLECER DÍA
    ======================================================== */

    selectorDia.value =
        String(dia);


    /* ========================================================
       ESTABLECER MES
    ======================================================== */

    selectorMes.value =
        String(mes);


    console.log(
        `Fecha inicial establecida: ${dia}/${mes}`
    );

}


/* ============================================================
   INICIALIZACIÓN FINAL
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarInformacionUsuario();

    }
);

/* ============================================================
   FIN DE LA PARTE 3
============================================================ */
/* ============================================================
   PROTECCIÓN CONTRA ERRORES DE BOTONES
============================================================ */

/*
 * Esta función comprueba si una función existe antes de
 * ejecutarla. Sirve para evitar errores cuando algún módulo
 * todavía no ha terminado de cargarse.
 */

function ejecutarSiExiste(
    nombreFuncion,
    ...argumentos
) {

    if (
        typeof window[nombreFuncion] ===
        "function"
    ) {

        return window[nombreFuncion](
            ...argumentos
        );

    }


    console.warn(
        `No existe la función ${nombreFuncion}().`
    );

}


/* ============================================================
   BOTÓN DE AJUSTES
============================================================ */

/*
 * El icono de ajustes se encuentra ahora en la cabecera.
 *
 * settings.js proporciona:
 *
 * mostrarMenuAjustes()
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const botonAjustes =
            document.getElementById(
                "btnAjustes"
            );


        if (
            botonAjustes
        ) {

            /*
             * El onclick del HTML ya llama a
             * mostrarMenuAjustes().
             *
             * No añadimos otro listener para evitar
             * que se abra dos veces.
             */

            console.log(
                "Botón de ajustes preparado."
            );

        }

    }
);


/* ============================================================
   CONTROL DE SESIÓN
============================================================ */

/*
 * Si auth.js proporciona cerrarSesion(), lo utilizamos.
 *
 * No creamos una segunda función cerrarSesion() aquí porque
 * podría provocar conflictos con auth.js.
 */

function solicitarCerrarSesion() {

    if (
        typeof cerrarSesion ===
        "function"
    ) {

        cerrarSesion();

        return;

    }


    console.warn(
        "No existe cerrarSesion()."
    );

}


/* ============================================================
   CONTROL DE VISIBILIDAD
============================================================ */

/*
 * Algunas versiones anteriores de la aplicación utilizaban
 * estas funciones desde otros módulos.
 */

function mostrarSiExiste(
    id
) {

    const elemento =
        document.getElementById(
            id
        );


    if (
        elemento
    ) {

        elemento.classList.remove(
            "hidden"
        );

    }

}


function ocultarSiExiste(
    id
) {

    const elemento =
        document.getElementById(
            id
        );


    if (
        elemento
    ) {

        elemento.classList.add(
            "hidden"
        );

    }

}


/* ============================================================
   COMPROBACIÓN DE ELEMENTOS PRINCIPALES
============================================================ */

function comprobarInterfaz() {

    const elementos = {

        dia:
            document.getElementById(
                "dia"
            ),

        mes:
            document.getElementById(
                "mes"
            ),

        buscar:
            document.getElementById(
                "btnBuscar"
            ),

        hoy:
            document.getElementById(
                "btnHoy"
            ),

        siguiente:
            document.getElementById(
                "btnDiaSiguiente"
            ),

        ajustes:
            document.getElementById(
                "btnAjustes"
            )

    };


    console.log(
        "Elementos principales de la interfaz:",
        elementos
    );


    return elementos;

}


/* ============================================================
   INICIALIZACIÓN FINAL DE LA INTERFAZ
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTimeout(
            function () {

                comprobarInterfaz();

            },
            200
        );

    }
);


/* ============================================================
   EXPONER FUNCIONES AL WINDOW
============================================================ */

/*
 * Las funciones principales se exponen explícitamente para
 * que los botones del HTML puedan utilizarlas mediante
 * onclick.
 */

window.irAHoy =
    irAHoy;


window.diaSiguiente =
    diaSiguiente;


window.cargarDatosOnline =
    cargarDatosOnline;


window.mostrarError =
    mostrarError;


window.mostrarMensaje =
    mostrarMensaje;


/* ============================================================
   FIN DE APP.JS
============================================================ */

console.log(
    "app.js cargado correctamente."
);