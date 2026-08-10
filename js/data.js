/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   GESTIÓN Y CARGA DE DATOS
   Versión 2.0
============================================================ */

let cuadrantes = {};
let telefonos = {};
let usuarios = {};


/* ============================================================
   CARGAR CUADRANTES
============================================================ */

async function cargarCuadrantes() {

    try {

        const respuesta = await fetch(
            `${RUTAS_DATOS.cuadrantes}?t=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }

        const datos =
            await respuesta.json();

        cuadrantes = datos || {};

        actualizarFechaSincronizacion(
            cuadrantes
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
   CARGAR TELÉFONOS
============================================================ */

async function cargarTelefonos() {

    try {

        const respuesta = await fetch(
            `${RUTAS_DATOS.telefonos}?t=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }

        const datos =
            await respuesta.json();

        telefonos = datos || {};

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
   CARGAR USUARIOS
============================================================ */

async function cargarUsuarios() {

    try {

        const respuesta = await fetch(
            `${RUTAS_DATOS.usuarios}?t=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }

        const datos =
            await respuesta.json();

        /*
         * Nuestro nuevo usuarios.json utiliza:
         *
         * {
         *     "admin": {...},
         *     "AHU647": {...},
         *     ...
         * }
         *
         * Por tanto lo conservamos como objeto.
         */

        if (
            datos &&
            typeof datos === "object" &&
            !Array.isArray(datos)
        ) {

            usuarios = datos;

        } else {

            usuarios = {};

        }

        console.log(
            "Usuarios cargados correctamente:",
            Object.keys(usuarios).length
        );

        return true;

    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

        usuarios = {};

        return false;

    }

}


/* ============================================================
   CARGAR TODOS LOS DATOS
============================================================ */

async function cargarTodosLosDatos() {

    const resultados =
        await Promise.all([

            cargarCuadrantes(),

            cargarTelefonos(),

            cargarUsuarios()

        ]);


    const cuadrantesOK =
        resultados[0];

    const telefonosOK =
        resultados[1];

    const usuariosOK =
        resultados[2];


    console.log(
        "Resultado carga de datos:",
        {
            cuadrantes: cuadrantesOK,
            telefonos: telefonosOK,
            usuarios: usuariosOK
        }
    );


    return {

        cuadrantes:
            cuadrantesOK,

        telefonos:
            telefonosOK,

        usuarios:
            usuariosOK,

        correcto:
            cuadrantesOK &&
            telefonosOK &&
            usuariosOK

    };

}


/* ============================================================
   COMPATIBILIDAD CON app.js
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

    if (!datos) {

        return;

    }


    const elemento =
        document.getElementById(
            "ultimaActualizacion"
        );


    if (!elemento) {

        return;

    }


    if (datos.actualizado) {

        elemento.textContent =
            `Última sincronización: ${datos.actualizado}`;

    } else {

        elemento.textContent =
            "Última sincronización: Desconocida";

    }

}


/* ============================================================
   OBTENER DATOS DE UN MES
============================================================ */

function obtenerDatosMes(
    nombreMes
) {

    if (!nombreMes) {

        return [];

    }


    if (!cuadrantes) {

        return [];

    }


    const datos =
        cuadrantes[nombreMes];


    if (!Array.isArray(datos)) {

        return [];

    }


    return datos;

}


/* ============================================================
   OBTENER REGISTROS DE UN DÍA
============================================================ */

function obtenerDatosDia(
    nombreMes,
    dia
) {

    const datosMes =
        obtenerDatosMes(
            nombreMes
        );


    const numeroDia =
        parseInt(dia);


    if (
        !datosMes.length ||
        Number.isNaN(numeroDia)
    ) {

        return [];

    }


    return datosMes.filter(
        item =>
            parseInt(item.dia) ===
            numeroDia
    );

}


/* ============================================================
   OBTENER SERVICIO DE UN AGENTE
============================================================ */

function obtenerServicioAgente(
    nombreAgente,
    nombreMes,
    dia
) {

    const datosDia =
        obtenerDatosDia(
            nombreMes,
            dia
        );


    const nombre =
        normalizarTexto(
            nombreAgente
        );


    const registro =
        datosDia.find(
            item =>
                normalizarTexto(
                    item.agente
                ) === nombre
        );


    if (!registro) {

        return null;

    }


    return {

        agente:
            registro.agente,

        turno:
            String(
                registro.turno || ""
            ).trim(),

        dia:
            parseInt(
                registro.dia
            ),

        mes:
            nombreMes

    };

}


/* ============================================================
   OBTENER TODOS LOS AGENTES DE UN TURNO
============================================================ */

function obtenerAgentesPorTurno(
    nombreMes,
    dia,
    turno
) {

    const datosDia =
        obtenerDatosDia(
            nombreMes,
            dia
        );


    const codigo =
        String(
            turno
        ).trim();


    return datosDia

        .filter(
            item =>
                String(
                    item.turno || ""
                ).trim() ===
                codigo
        )

        .map(
            item =>
                item.agente
        );

}


/* ============================================================
   OBTENER TODOS LOS AGENTES DE UN DÍA
============================================================ */

function obtenerTodosLosAgentesDelDia(
    nombreMes,
    dia
) {

    return obtenerDatosDia(
        nombreMes,
        dia
    );

}


/* ============================================================
   OBTENER TELÉFONO DE UN AGENTE
============================================================ */

function obtenerTelefonoAgente(
    nombreAgente
) {

    if (!telefonos) {

        return "";

    }


    const nombre =
        normalizarTexto(
            nombreAgente
        );


    /*
     * Formato array
     */

    if (Array.isArray(telefonos)) {

        const registro =
            telefonos.find(
                item =>
                    normalizarTexto(
                        item.agente ||
                        item.nombre
                    ) === nombre
            );


        if (!registro) {

            return "";

        }


        return (
            registro.telefono ||
            registro.numero ||
            ""
        );

    }


    /*
     * Formato objeto
     */

    if (
        typeof telefonos ===
        "object"
    ) {

        for (
            const clave in telefonos
        ) {

            if (
                normalizarTexto(
                    clave
                ) === nombre
            ) {

                const valor =
                    telefonos[clave];


                if (
                    typeof valor ===
                    "string"
                ) {

                    return valor;

                }


                if (
                    valor &&
                    typeof valor ===
                    "object"
                ) {

                    return (
                        valor.telefono ||
                        valor.numero ||
                        ""
                    );

                }

            }

        }

    }


    return "";

}


/* ============================================================
   OBTENER USUARIO POR CONTRASEÑA
============================================================ */

function obtenerUsuarioPorPassword(
    password
) {

    if (
        !usuarios ||
        typeof usuarios !==
        "object"
    ) {

        return null;

    }


    const contraseña =
        String(
            password || ""
        ).trim();


    if (!contraseña) {

        return null;

    }


    for (
        const clave in usuarios
    ) {

        const usuario =
            usuarios[clave];


        if (
            usuario &&
            String(
                usuario.password || ""
            ).trim() ===
            contraseña
        ) {

            return {

                id:
                    clave,

                nombre:
                    usuario.nombre,

                tipo:
                    usuario.tipo,

                password:
                    usuario.password

            };

        }

    }


    return null;

}


/* ============================================================
   OBTENER USUARIO POR NOMBRE
============================================================ */

function obtenerUsuarioPorNombre(
    nombre
) {

    if (
        !usuarios ||
        typeof usuarios !==
        "object"
    ) {

        return null;

    }


    const nombreNormalizado =
        normalizarTexto(
            nombre
        );


    for (
        const clave in usuarios
    ) {

        const usuario =
            usuarios[clave];


        if (
            usuario &&
            normalizarTexto(
                usuario.nombre
            ) ===
            nombreNormalizado
        ) {

            return {

                id:
                    clave,

                nombre:
                    usuario.nombre,

                tipo:
                    usuario.tipo,

                password:
                    usuario.password

            };

        }

    }


    return null;

}


/* ============================================================
   OBTENER TODOS LOS USUARIOS
============================================================ */

function obtenerTodosLosUsuarios() {

    if (
        !usuarios ||
        typeof usuarios !==
        "object"
    ) {

        return [];

    }


    return Object.keys(
        usuarios
    ).map(
        clave => ({

            id:
                clave,

            nombre:
                usuarios[clave].nombre,

            tipo:
                usuarios[clave].tipo

        })
    );

}


/* ============================================================
   COMPROBAR SI EXISTEN LOS DATOS
============================================================ */

function datosDisponibles() {

    return (

        cuadrantes &&

        typeof cuadrantes ===
            "object" &&

        Object.keys(
            cuadrantes
        ).length > 0

    );

}


/* ============================================================
   FIN data.js
============================================================ */