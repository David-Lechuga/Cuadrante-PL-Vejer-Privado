/* ============================================================
   CUADRANTE POLICÍA LOCAL VEJER
   GESTIÓN DE DATOS
   Versión privada 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   VARIABLES GLOBALES
============================================================ */

let cuadrantes = {};

let usuarios = [];

let telefonos = {};

let datosCargados = false;


/* ============================================================
   RUTAS DE LOS ARCHIVOS
============================================================ */

const RUTA_CUADRANTES =
    "data/cuadrantes.json";

const RUTA_USUARIOS =
    "usuarios.json";

const RUTA_TELEFONOS =
    "data/telefonos.json";


/* ============================================================
   CARGAR CUADRANTES
============================================================ */

async function cargarCuadrantes() {

    try {

        const respuesta =
            await fetch(
                RUTA_CUADRANTES +
                "?t=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status} cargando cuadrantes`
            );

        }


        const datos =
            await respuesta.json();


        /*
         * ----------------------------------------------------
         * ESTRUCTURA ACTUAL DEL JSON
         * ----------------------------------------------------
         *
         * {
         *
         *     "actualizado": "...",
         *
         *     "cuadrantes": {
         *
         *         "ENERO": [...],
         *         "FEBRERO": [...],
         *         ...
         *         "DICIEMBRE": [...]
         *
         *     }
         *
         * }
         *
         * Guardamos el objeto completo porque necesitamos
         * conservar también la fecha de actualización.
         */

        cuadrantes =
            datos;


        actualizarFechaSincronizacion(
            datos
        );


        console.log(
            "Cuadrantes cargados correctamente."
        );


        return true;


    } catch (error) {

        console.error(
            "Error cargando cuadrantes:",
            error
        );


        cuadrantes = {};


        return false;

    }

}


/* ============================================================
   CARGAR USUARIOS
============================================================ */

async function cargarUsuarios() {

    try {

        const respuesta =
            await fetch(
                RUTA_USUARIOS +
                "?t=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status} cargando usuarios`
            );

        }


        const datos =
            await respuesta.json();


        /*
         * El usuarios.json actual puede venir como objeto:
         *
         * {
         *     "admin": {...},
         *     "AHU647": {...},
         *     ...
         * }
         *
         * Lo convertimos a array para que el resto de
         * la aplicación pueda trabajar de forma uniforme.
         */

        if (
            Array.isArray(datos)
        ) {

            usuarios =
                datos;

        } else if (
            datos &&
            typeof datos ===
            "object"
        ) {

            usuarios =
                Object.values(
                    datos
                );

        } else {

            usuarios = [];

        }


        console.log(
            "Usuarios cargados correctamente:",
            usuarios.length
        );


        return true;


    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );


        usuarios = [];


        return false;

    }

}


/* ============================================================
   CARGAR TELÉFONOS
============================================================ */

async function cargarTelefonos() {

    try {

        const respuesta =
            await fetch(
                RUTA_TELEFONOS +
                "?t=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status} cargando teléfonos`
            );

        }


        const datos =
            await respuesta.json();


        telefonos =
            datos;


        console.log(
            "Teléfonos cargados correctamente."
        );


        return true;


    } catch (error) {

        console.error(
            "Error cargando teléfonos:",
            error
        );


        telefonos = {};


        return false;

    }

}


/* ============================================================
   CARGAR TODOS LOS DATOS
============================================================ */

async function cargarTodosLosDatos() {

    console.log(
        "Cargando todos los datos..."
    );


    const resultados =
        await Promise.all([
            cargarCuadrantes(),
            cargarUsuarios(),
            cargarTelefonos()
        ]);


    datosCargados =
        resultados.every(
            resultado =>
                resultado === true
        );


    console.log(
        "Todos los datos han sido procesados."
    );


    return datosCargados;

}


/* ============================================================
   COMPATIBILIDAD
============================================================ */

async function cargarDatosOnline() {

    return await cargarTodosLosDatos();

}


/* ============================================================
   ACTUALIZAR FECHA DE SINCRONIZACIÓN
============================================================ */

function actualizarFechaSincronizacion(
    datos
) {

    if (
        !datos ||
        typeof datos !==
        "object"
    ) {

        return;

    }


    const elemento =
        document.getElementById(
            "ultimaActualizacion"
        );


    if (
        !elemento
    ) {

        return;

    }


    elemento.textContent =
        `Última sincronización: ${
            datos.actualizado ||
            "Desconocida"
        }`;

}


/* ============================================================
   COMPROBAR SI LOS DATOS ESTÁN DISPONIBLES
============================================================ */

function datosDisponibles() {

    return (
        cuadrantes &&
        typeof cuadrantes ===
        "object" &&
        cuadrantes.cuadrantes &&
        typeof cuadrantes.cuadrantes ===
        "object" &&
        Object.keys(
            cuadrantes.cuadrantes
        ).length > 0
    );

}

/* ============================================================
   UTILIDADES DE MESES
============================================================ */

/*
 * Los meses del cuadrante están almacenados en MAYÚSCULAS.
 *
 * Es importante mantener exactamente estos nombres porque
 * las claves de cuadrantes.json son:
 *
 * ENERO
 * FEBRERO
 * MARZO
 * ABRIL
 * MAYO
 * JUNIO
 * JULIO
 * AGOSTO
 * SEPTIEMBRE
 * OCTUBRE
 * NOVIEMBRE
 * DICIEMBRE
 */

const MESES =
    [
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


/* ============================================================
   OBTENER MESES
============================================================ */

function obtenerMeses() {

    return [
        ...MESES
    ];

}


/* ============================================================
   OBTENER NOMBRE DEL MES
============================================================ */

/*
 * Recibe:
 *
 *     0 → ENERO
 *     1 → FEBRERO
 *     2 → MARZO
 *
 * ...
 *
 *     7 → AGOSTO
 *
 * También acepta números de mes del 1 al 12.
 *
 * Para evitar el problema que teníamos anteriormente,
 * distinguimos entre índice JavaScript (0-11) y número
 * de mes convencional (1-12).
 */

function obtenerNombreMes(
    indice
) {

    const numero =
        Number(
            indice
        );


    if (
        Number.isNaN(
            numero
        )
    ) {

        return "";

    }


    /*
     * Si recibimos un índice JavaScript:
     *
     * 0 = ENERO
     * 7 = AGOSTO
     */

    if (
        numero >= 0 &&
        numero <= 11
    ) {

        return MESES[
            numero
        ];

    }


    /*
     * Si recibimos un número convencional:
     *
     * 1 = ENERO
     * 8 = AGOSTO
     * 12 = DICIEMBRE
     */

    if (
        numero >= 1 &&
        numero <= 12
    ) {

        return MESES[
            numero - 1
        ];

    }


    return "";

}


/* ============================================================
   OBTENER NÚMERO DE MES
============================================================ */

function obtenerNumeroMes(
    nombreMes
) {

    if (
        !nombreMes
    ) {

        return 0;

    }


    const nombre =
        String(
            nombreMes
        )
        .trim()
        .toUpperCase();


    const indice =
        MESES.indexOf(
            nombre
        );


    if (
        indice < 0
    ) {

        return 0;

    }


    return indice + 1;

}


/* ============================================================
   OBTENER DÍAS DEL MES
============================================================ */

function obtenerDiasDelMes(
    numeroMes
) {

    const dias =
        [
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


    const numero =
        Number(
            numeroMes
        );


    if (
        Number.isNaN(
            numero
        )
    ) {

        return 31;

    }


    return (
        dias[
            numero - 1
        ] ||
        31
    );

}


/* ============================================================
   OBTENER DATOS DE UN MES
============================================================ */

/*
 * Esta es una de las funciones IMPORTANTES para solucionar
 * el problema actual.
 *
 * La estructura real de cuadrantes.json es:
 *
 * {
 *
 *     "actualizado": "...",
 *
 *     "cuadrantes": {
 *
 *         "ENERO": [...],
 *         "FEBRERO": [...],
 *         ...
 *         "AGOSTO": [...]
 *
 *     }
 *
 * }
 *
 * Por tanto NO debemos hacer:
 *
 *     cuadrantes[nombreMes]
 *
 * sino:
 *
 *     cuadrantes.cuadrantes[nombreMes]
 *
 */

function obtenerDatosMes(
    nombreMes
) {

    if (
        !nombreMes
    ) {

        return [];

    }


    if (
        !cuadrantes ||
        typeof cuadrantes !==
        "object"
    ) {

        return [];

    }


    if (
        !cuadrantes.cuadrantes ||
        typeof cuadrantes.cuadrantes !==
        "object"
    ) {

        return [];

    }


    const nombre =
        String(
            nombreMes
        )
        .trim()
        .toUpperCase();


    const datos =
        cuadrantes
            .cuadrantes[
                nombre
            ];


    if (
        !Array.isArray(
            datos
        )
    ) {

        console.warn(
            "No existen datos para el mes:",
            nombre
        );


        return [];

    }


    return datos;

}


/* ============================================================
   OBTENER DATOS DE UN AGENTE
============================================================ */

function obtenerDatosAgente(
    nombre,
    nombreMes
) {

    const datosMes =
        obtenerDatosMes(
            nombreMes
        );


    if (
        !Array.isArray(
            datosMes
        )
    ) {

        return null;

    }


    return (
        datosMes.find(
            agente => {

                if (
                    !agente ||
                    typeof agente !==
                    "object"
                ) {

                    return false;

                }


                const nombreAgente =
                    agente.nombre ||
                    agente.NOMBRE ||
                    "";


                return (
                    String(
                        nombreAgente
                    )
                    .trim()
                    .toUpperCase() ===
                    String(
                        nombre
                    )
                    .trim()
                    .toUpperCase()
                );

            }
        ) ||
        null
    );

}


/* ============================================================
   OBTENER TURNOS DE UN AGENTE
============================================================ */

function obtenerTurnosAgente(
    nombre,
    nombreMes
) {

    const agente =
        obtenerDatosAgente(
            nombre,
            nombreMes
        );


    if (
        !agente
    ) {

        return [];

    }


    /*
     * El cuadrante utiliza las propiedades del agente
     * para almacenar los días.
     *
     * Devolvemos el objeto directamente para que las
     * funciones de búsqueda puedan utilizarlo.
     */

    return agente;

}


/* ============================================================
   COMPROBAR MES EXISTENTE
============================================================ */

function existeMes(
    nombreMes
) {

    const nombre =
        String(
            nombreMes || ""
        )
        .trim()
        .toUpperCase();


    return (
        MESES.includes(
            nombre
        ) &&
        Array.isArray(
            cuadrantes?.cuadrantes?.[
                nombre
            ]
        )
    );

}


/* ============================================================
   FIN PARTE 2
============================================================ */

/* ============================================================
   BÚSQUEDA DE USUARIOS
============================================================ */

/*
 * Busca un usuario por su identificador.
 *
 * Ejemplo:
 *
 *     obtenerUsuario("AHU647")
 *
 */

function obtenerUsuario(
    id
) {

    if (
        !id
    ) {

        return null;

    }


    const identificador =
        String(
            id
        )
        .trim()
        .toUpperCase();


    if (
        !Array.isArray(
            usuarios
        )
    ) {

        return null;

    }


    return (
        usuarios.find(
            usuario => {

                if (
                    !usuario ||
                    typeof usuario !==
                    "object"
                ) {

                    return false;

                }


                const usuarioId =
                    usuario.id ||
                    usuario.ID ||
                    usuario.usuario ||
                    usuario.USUARIO ||
                    "";


                return (
                    String(
                        usuarioId
                    )
                    .trim()
                    .toUpperCase() ===
                    identificador
                );

            }
        ) ||
        null
    );

}


/* ============================================================
   BUSCAR USUARIO POR CONTRASEÑA
============================================================ */

function obtenerUsuarioPorPassword(
    password
) {

    if (
        !password
    ) {

        return null;

    }


    const clave =
        String(
            password
        );


    if (
        !Array.isArray(
            usuarios
        )
    ) {

        return null;

    }


    return (
        usuarios.find(
            usuario => {

                if (
                    !usuario ||
                    typeof usuario !==
                    "object"
                ) {

                    return false;

                }


                return (
                    String(
                        usuario.password ??
                        ""
                    ) ===
                    clave
                );

            }
        ) ||
        null
    );

}


/* ============================================================
   OBTENER TODOS LOS USUARIOS
============================================================ */

function obtenerUsuarios() {

    if (
        !Array.isArray(
            usuarios
        )
    ) {

        return [];

    }


    return [
        ...usuarios
    ];

}


/* ============================================================
   COMPROBAR SI EXISTE UN USUARIO
============================================================ */

function existeUsuario(
    id
) {

    return (
        obtenerUsuario(
            id
        ) !== null
    );

}


/* ============================================================
   OBTENER TELÉFONO DE UN AGENTE
============================================================ */

function obtenerTelefono(
    nombre
) {

    if (
        !nombre ||
        !telefonos ||
        typeof telefonos !==
        "object"
    ) {

        return null;

    }


    const clave =
        String(
            nombre
        )
        .trim();


    /*
     * Primero intentamos coincidencia directa.
     */

    if (
        telefonos[
            clave
        ]
    ) {

        return telefonos[
            clave
        ];

    }


    /*
     * Después hacemos una búsqueda sin distinguir
     * mayúsculas/minúsculas.
     */

    const claveEncontrada =
        Object.keys(
            telefonos
        )
        .find(
            key =>
                key
                    .trim()
                    .toUpperCase() ===
                clave
                    .toUpperCase()
        );


    if (
        claveEncontrada
    ) {

        return telefonos[
            claveEncontrada
        ];

    }


    return null;

}


/* ============================================================
   OBTENER TELÉFONO POR ID
============================================================ */

function obtenerTelefonoPorId(
    id
) {

    const usuario =
        obtenerUsuario(
            id
        );


    if (
        !usuario
    ) {

        return null;

    }


    return obtenerTelefono(
        usuario.nombre ||
        usuario.NOMBRE ||
        ""
    );

}


/* ============================================================
   OBTENER NOMBRE DE USUARIO
============================================================ */

function obtenerNombreUsuario(
    id
) {

    const usuario =
        obtenerUsuario(
            id
        );


    if (
        !usuario
    ) {

        return "";

    }


    return (
        usuario.nombre ||
        usuario.NOMBRE ||
        usuario.id ||
        usuario.ID ||
        ""
    );

}


/* ============================================================
   OBTENER TIPO DE USUARIO
============================================================ */

function obtenerTipoUsuario(
    id
) {

    const usuario =
        obtenerUsuario(
            id
        );


    if (
        !usuario
    ) {

        return "";

    }


    return (
        usuario.tipo ||
        usuario.TIPO ||
        ""
    );

}


/* ============================================================
   OBTENER INFORMACIÓN DE UN USUARIO
============================================================ */

function obtenerInformacionUsuario(
    id
) {

    const usuario =
        obtenerUsuario(
            id
        );


    if (
        !usuario
    ) {

        return null;

    }


    return {
        id:
            usuario.id ||
            usuario.ID ||
            "",

        nombre:
            usuario.nombre ||
            usuario.NOMBRE ||
            "",

        tipo:
            usuario.tipo ||
            usuario.TIPO ||
            "",

        password:
            usuario.password ||
            ""
    };

}


/* ============================================================
   FIN PARTE 3
============================================================ */

/* ============================================================
   FUNCIONES AUXILIARES DE CUADRANTE
============================================================ */

/*
 * Devuelve todos los agentes de un mes.
 */

function obtenerAgentesMes(
    nombreMes
) {

    const datosMes =
        obtenerDatosMes(
            nombreMes
        );


    if (
        !Array.isArray(
            datosMes
        )
    ) {

        return [];

    }


    return [
        ...datosMes
    ];

}


/* ============================================================
   BUSCAR AGENTE EN UN MES
============================================================ */

function buscarAgenteEnMes(
    nombre,
    nombreMes
) {

    return obtenerDatosAgente(
        nombre,
        nombreMes
    );

}


/* ============================================================
   OBTENER TURNO DE UN AGENTE EN UN DÍA
============================================================ */

function obtenerTurnoAgente(
    nombre,
    nombreMes,
    dia
) {

    const agente =
        obtenerDatosAgente(
            nombre,
            nombreMes
        );


    if (
        !agente
    ) {

        return null;

    }


    const numeroDia =
        Number(
            dia
        );


    if (
        Number.isNaN(
            numeroDia
        )
    ) {

        return null;

    }


    /*
     * Los datos del cuadrante pueden utilizar:
     *
     * "1", "2", "3"...
     *
     * o
     *
     * "D1", "D2"...
     *
     * Intentamos ambas posibilidades.
     */

    const posiblesClaves =
        [
            String(
                numeroDia
            ),

            `D${numeroDia}`,

            `dia${numeroDia}`,

            `Dia${numeroDia}`,

            `DIA${numeroDia}`
        ];


    for (
        const clave of posiblesClaves
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                agente,
                clave
            )
        ) {

            return agente[
                clave
            ];

        }

    }


    /*
     * Si no hemos encontrado una propiedad directa,
     * comprobamos si existe un array de turnos.
     */

    if (
        Array.isArray(
            agente.turnos
        )
    ) {

        return (
            agente.turnos[
                numeroDia - 1
            ] ??
            null
        );

    }


    return null;

}


/* ============================================================
   OBTENER TODOS LOS TURNOS DE UN AGENTE
============================================================ */

function obtenerTodosLosTurnosAgente(
    nombre,
    nombreMes
) {

    const agente =
        obtenerDatosAgente(
            nombre,
            nombreMes
        );


    if (
        !agente
    ) {

        return [];

    }


    /*
     * Si existe un array de turnos lo devolvemos.
     */

    if (
        Array.isArray(
            agente.turnos
        )
    ) {

        return [
            ...agente.turnos
        ];

    }


    /*
     * En caso contrario construimos el array a partir
     * de los días disponibles.
     */

    const resultado =
        [];


    for (
        let dia = 1;
        dia <= 31;
        dia++
    ) {

        resultado.push(
            obtenerTurnoAgente(
                nombre,
                nombreMes,
                dia
            )
        );

    }


    return resultado;

}


/* ============================================================
   OBTENER TODOS LOS AGENTES DE UN TURNO
============================================================ */

function obtenerAgentesPorTurno(
    nombreMes,
    dia,
    turnoBuscado
) {

    const datosMes =
        obtenerDatosMes(
            nombreMes
        );


    if (
        !Array.isArray(
            datosMes
        )
    ) {

        return [];

    }


    const turno =
        String(
            turnoBuscado ||
            ""
        )
        .trim()
        .toUpperCase();


    const resultado =
        [];


    datosMes.forEach(
        agente => {

            if (
                !agente ||
                typeof agente !==
                "object"
            ) {

                return;

            }


            const nombre =
                agente.nombre ||
                agente.NOMBRE ||
                "";


            const turnoAgente =
                obtenerTurnoAgente(
                    nombre,
                    nombreMes,
                    dia
                );


            if (
                String(
                    turnoAgente ||
                    ""
                )
                .trim()
                .toUpperCase() ===
                turno
            ) {

                resultado.push(
                    nombre
                );

            }

        }
    );


    return resultado;

}


/* ============================================================
   OBTENER AGENTES DE TODOS LOS TURNOS
============================================================ */

function obtenerAgentesDelDia(
    nombreMes,
    dia
) {

    const datosMes =
        obtenerDatosMes(
            nombreMes
        );


    if (
        !Array.isArray(
            datosMes
        )
    ) {

        return [];

    }


    const resultado =
        [];


    datosMes.forEach(
        agente => {

            if (
                !agente ||
                typeof agente !==
                "object"
            ) {

                return;

            }


            const nombre =
                agente.nombre ||
                agente.NOMBRE ||
                "";


            const turno =
                obtenerTurnoAgente(
                    nombre,
                    nombreMes,
                    dia
                );


            resultado.push({
                nombre:
                    nombre,

                turno:
                    turno
            });

        }
    );


    return resultado;

}


/* ============================================================
   COMPROBAR SI EXISTEN DATOS PARA UN DÍA
============================================================ */

function existenDatosParaDia(
    nombreMes,
    dia
) {

    const agentes =
        obtenerAgentesDelDia(
            nombreMes,
            dia
        );


    return (
        agentes.length > 0
    );

}


/* ============================================================
   OBTENER FECHA DE ACTUALIZACIÓN
============================================================ */

function obtenerFechaActualizacion() {

    if (
        !cuadrantes ||
        typeof cuadrantes !==
        "object"
    ) {

        return "";

    }


    return (
        cuadrantes.actualizado ||
        ""
    );

}


/* ============================================================
   FIN PARTE 4
============================================================ */

/* ============================================================
   UTILIDADES DE NORMALIZACIÓN
============================================================ */

/*
 * Normaliza un nombre de mes.
 *
 * Permite recibir:
 *
 *     Agosto
 *     AGOSTO
 *     agosto
 *
 * y siempre devuelve:
 *
 *     AGOSTO
 */

function normalizarMes(
    nombreMes
) {

    if (
        !nombreMes
    ) {

        return "";

    }


    const texto =
        String(
            nombreMes
        )
        .trim()
        .toUpperCase();


    /*
     * Si ya es un mes válido, lo devolvemos.
     */

    if (
        MESES.includes(
            texto
        )
    ) {

        return texto;

    }


    /*
     * Intentamos buscarlo ignorando acentos.
     */

    const sinAcentos =
        texto.normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );


    const encontrado =
        MESES.find(
            mes =>
                mes.normalize(
                    "NFD"
                )
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                ) ===
                sinAcentos
        );


    return encontrado || "";

}


/* ============================================================
   OBTENER MES DESDE SELECTOR
============================================================ */

function obtenerMesDesdeSelector() {

    const selector =
        document.getElementById(
            "mes"
        );


    if (
        !selector
    ) {

        return "";

    }


    return normalizarMes(
        selector.value
    );

}


/* ============================================================
   OBTENER DÍA DESDE SELECTOR
============================================================ */

function obtenerDiaDesdeSelector() {

    const selector =
        document.getElementById(
            "dia"
        );


    if (
        !selector
    ) {

        return 0;

    }


    const dia =
        parseInt(
            selector.value,
            10
        );


    return (
        Number.isNaN(
            dia
        )
            ? 0
            : dia
    );

}


/* ============================================================
   INFORMACIÓN GENERAL DEL CUADRANTE
============================================================ */

function obtenerInformacionCuadrante() {

    return {

        actualizado:
            obtenerFechaActualizacion(),

        meses:
            obtenerMeses(),

        datosDisponibles:
            datosDisponibles()

    };

}


/* ============================================================
   LIMPIAR DATOS
============================================================ */

function limpiarDatos() {

    cuadrantes = {};

    usuarios = [];

    telefonos = {};

    datosCargados = false;

}


/* ============================================================
   RECARGAR DATOS
============================================================ */

async function recargarDatos() {

    console.log(
        "Recargando datos..."
    );


    datosCargados =
        false;


    const resultado =
        await cargarTodosLosDatos();


    if (
        resultado
    ) {

        console.log(
            "Datos recargados correctamente."
        );

    } else {

        console.error(
            "No se pudieron recargar todos los datos."
        );

    }


    return resultado;

}


/* ============================================================
   COMPROBACIÓN FINAL DE DATOS
============================================================ */

function comprobarDatos() {

    console.log(
        "Comprobación de datos:"
    );


    console.log(
        "Cuadrantes:",
        cuadrantes
    );


    console.log(
        "Usuarios:",
        Array.isArray(
            usuarios
        )
            ? usuarios.length
            : 0
    );


    console.log(
        "Teléfonos:",
        telefonos
    );


    console.log(
        "Meses disponibles:",
        obtenerMeses()
    );


    console.log(
        "Datos disponibles:",
        datosDisponibles()
    );


    return datosDisponibles();

}


/* ============================================================
   INICIALIZACIÓN
============================================================ */

console.log(
    "data.js cargado correctamente."
);