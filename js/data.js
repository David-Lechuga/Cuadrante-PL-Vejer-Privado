/* ============================================================
   DATA.JS
   GESTIÓN DE DATOS
   CUADRANTE POLICÍA LOCAL VEJER
============================================================ */

let cuadrantes = {};
let telefonos = {};
let usuarios = {};


/* ============================================================
   RUTAS
============================================================ */

const RUTA_CUADRANTES =
    "cuadrantes.json";

const RUTA_TELEFONOS =
    "telefonos.json";

const RUTA_USUARIOS =
    "usuarios.json";


/* ============================================================
   CARGAR CUADRANTES
============================================================ */

async function cargarCuadrantes() {

    try {

        const respuesta =
            await fetch(
                `${RUTA_CUADRANTES}?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }


        cuadrantes =
            await respuesta.json();


        console.log(
            "Cuadrantes cargados correctamente."
        );


        return cuadrantes;

    } catch (error) {

        console.error(
            "Error cargando cuadrantes.json:",
            error
        );

        cuadrantes = {};

        return null;

    }

}


/* ============================================================
   CARGAR TELÉFONOS
============================================================ */

async function cargarTelefonos() {

    try {

        const respuesta =
            await fetch(
                `${RUTA_TELEFONOS}?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }


        telefonos =
            await respuesta.json();


        console.log(
            "Teléfonos cargados correctamente."
        );


        return telefonos;

    } catch (error) {

        console.error(
            "Error cargando telefonos.json:",
            error
        );

        telefonos = {};

        return null;

    }

}


/* ============================================================
   CARGAR USUARIOS
============================================================ */

async function cargarUsuariosDatos() {

    try {

        const respuesta =
            await fetch(
                `${RUTA_USUARIOS}?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }


        usuarios =
            await respuesta.json();


        /*
         * Nuestro usuarios.json actual es un OBJETO:
         *
         * {
         *     "admin": {...},
         *     "AHU647": {...},
         *     "AIS076": {...}
         * }
         *
         * Por eso NO utilizamos .find().
         */

        if (
            !usuarios ||
            typeof usuarios !== "object" ||
            Array.isArray(usuarios)
        ) {

            throw new Error(
                "usuarios.json no tiene el formato esperado."
            );

        }


        console.log(
            "Usuarios cargados correctamente:",
            Object.keys(usuarios).length
        );


        return usuarios;

    } catch (error) {

        console.error(
            "Error cargando usuarios.json:",
            error
        );

        usuarios = {};

        return null;

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
            cargarTelefonos(),
            cargarUsuariosDatos()
        ]);


    /*
     * Guardar timestamp de carga.
     */

    window.datosCargados =
        new Date();


    console.log(
        "Todos los datos han sido procesados."
    );


    return {

        cuadrantes:
            resultados[0],

        telefonos:
            resultados[1],

        usuarios:
            resultados[2]

    };

}


/* ============================================================
   OBTENER MESES
============================================================ */

function obtenerMeses() {

    if (
        !cuadrantes ||
        typeof cuadrantes !== "object"
    ) {

        return [];

    }


    return Object.keys(
        cuadrantes
    );

}


/* ============================================================
   OBTENER DATOS DE UN MES
============================================================ */

function obtenerDatosMes(
    mes
) {

    if (
        !mes ||
        !cuadrantes
    ) {

        return null;

    }


    return cuadrantes[
        mes
    ] || null;

}


/* ============================================================
   OBTENER DATOS DE UN DÍA
============================================================ */

function obtenerDatosDia(
    mes,
    dia
) {

    const datosMes =
        obtenerDatosMes(
            mes
        );


    if (!datosMes) {

        return null;

    }


    /*
     * Compatibilidad con diferentes estructuras:
     *
     * datosMes[dia]
     *
     * o
     *
     * registros con propiedad dia.
     */

    if (
        datosMes[dia] !== undefined
    ) {

        return datosMes[dia];

    }


    if (
        Array.isArray(datosMes)
    ) {

        return datosMes.find(
            registro =>
                String(
                    registro.dia
                ) === String(dia)
        ) || null;

    }


    return null;

}


/* ============================================================
   OBTENER USUARIO POR ID
============================================================ */

function obtenerUsuario(
    id
) {

    if (
        !usuarios ||
        typeof usuarios !== "object"
    ) {

        return null;

    }


    return usuarios[
        id
    ] || null;

}


/* ============================================================
   OBTENER USUARIOS COMO ARRAY
============================================================ */

function obtenerListaUsuarios() {

    if (
        !usuarios ||
        typeof usuarios !== "object"
    ) {

        return [];

    }


    return Object.entries(
        usuarios
    ).map(
        (
            [
                id,
                usuario
            ]
        ) => ({

            id:
                id,

            ...usuario

        })
    );

}


/* ============================================================
   OBTENER USUARIO POR CONTRASEÑA
============================================================ */

function obtenerUsuarioPorPassword(
    password
) {

    if (
        !password ||
        !usuarios ||
        typeof usuarios !== "object"
    ) {

        return null;

    }


    const passwordBuscada =
        String(
            password
        ).trim();


    for (
        const id in usuarios
    ) {

        const usuario =
            usuarios[id];


        if (!usuario) {

            continue;

        }


        const passwordUsuario =
            String(
                usuario.password || ""
            ).trim();


        if (
            passwordUsuario ===
            passwordBuscada
        ) {

            return {

                id:
                    id,

                nombre:
                    usuario.nombre ||
                    id,

                tipo:
                    usuario.tipo ||
                    "agente",

                password:
                    usuario.password

            };

        }

    }


    return null;

}


/* ============================================================
   OBTENER TELÉFONO DE UN AGENTE
============================================================ */

function obtenerTelefono(
    nombre
) {

    if (
        !telefonos ||
        typeof telefonos !== "object"
    ) {

        return null;

    }


    /*
     * Primero intentamos directamente con el nombre.
     */

    if (
        telefonos[nombre]
    ) {

        return telefonos[nombre];

    }


    /*
     * Si telefonos.json utiliza identificadores,
     * intentamos recorrerlo.
     */

    for (
        const id in telefonos
    ) {

        const registro =
            telefonos[id];


        if (!registro) {

            continue;

        }


        if (
            registro.nombre ===
            nombre
        ) {

            return registro;

        }

    }


    return null;

}


/* ============================================================
   OBTENER CUADRANTES
============================================================ */

function obtenerCuadrantes() {

    return cuadrantes;

}


/* ============================================================
   OBTENER TELÉFONOS
============================================================ */

function obtenerTelefonos() {

    return telefonos;

}


/* ============================================================
   OBTENER USUARIOS
============================================================ */

function obtenerUsuarios() {

    return usuarios;

}


/* ============================================================
   ACTUALIZACIÓN
============================================================ */

function obtenerFechaActualizacion() {

    if (
        cuadrantes &&
        cuadrantes.actualizado
    ) {

        return cuadrantes.actualizado;

    }


    if (
        window.datosCargados
    ) {

        return window.datosCargados;

    }


    return null;

}


/* ============================================================
   FIN DATA.JS
============================================================ */

console.log(
    "data.js cargado correctamente."
);