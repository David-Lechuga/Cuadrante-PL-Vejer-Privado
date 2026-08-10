/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   GESTIÓN Y CARGA DE DATOS
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   CARGAR CUADRANTE
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

        cuadrantes = datos;

        actualizarFechaSincronizacion(datos);

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

        telefonos = datos;

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
           Admitimos dos formatos:

           1. usuarios.json contiene directamente un array.

           2. usuarios.json contiene:
              {
                  "usuarios": [...]
              }
        */

        if (Array.isArray(datos)) {

            usuarios = datos;

        } else if (
            datos &&
            Array.isArray(datos.usuarios)
        ) {

            usuarios = datos.usuarios;

        } else {

            usuarios = [];

        }

        console.log(
            "Usuarios cargados correctamente."
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
   ACTUALIZAR FECHA DE SINCRONIZACIÓN
============================================================ */

function actualizarFechaSincronizacion(datos) {

    if (!datos) {

        return;

    }

    const elemento =
        obtenerElemento(
            "ultimaActualizacion"
        );

    if (!elemento) {

        return;

    }

    if (datos.actualizado) {

        elemento.textContent =
            `${TEXTOS.ultimaSincronizacion} ${datos.actualizado}`;

    } else {

        elemento.textContent =
            `${TEXTOS.ultimaSincronizacion} Desconocida`;

    }

}


/* ============================================================
   OBTENER DATOS DE UN MES
============================================================ */

function obtenerDatosMes(nombreMes) {

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
        obtenerDatosMes(nombreMes);

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
            parseInt(registro.dia),

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
        String(turno).trim();

    return datosDia

        .filter(
            item =>
                String(
                    item.turno || ""
                ).trim() === codigo
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
       Admitimos diferentes estructuras
       para facilitar la compatibilidad con
       el telefonos.json actual.
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


    if (
        typeof telefonos === "object"
    ) {

        for (
            const clave in telefonos
        ) {

            if (
                normalizarTexto(clave) ===
                nombre
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
   OBTENER REGISTRO DE USUARIO
============================================================ */

function obtenerUsuarioPorPassword(
    password
) {

    if (!Array.isArray(usuarios)) {

        return null;

    }

    const contraseña =
        String(password || "").trim();

    if (!contraseña) {

        return null;

    }

    return usuarios.find(
        usuario =>
            String(
                usuario.password || ""
            ).trim() === contraseña
    ) || null;

}


/* ============================================================
   OBTENER USUARIO POR NOMBRE
============================================================ */

function obtenerUsuarioPorNombre(
    nombre
) {

    if (!Array.isArray(usuarios)) {

        return null;

    }

    const nombreNormalizado =
        normalizarTexto(
            nombre
        );

    return usuarios.find(
        usuario =>
            normalizarTexto(
                usuario.nombre
            ) === nombreNormalizado
    ) || null;

}


/* ============================================================
   COMPROBAR SI EXISTEN LOS DATOS PRINCIPALES
============================================================ */

function datosDisponibles() {

    return (

        cuadrantes &&
        typeof cuadrantes ===
            "object" &&

        Object.keys(cuadrantes)
            .length > 0

    );

}


/* ============================================================
   FIN DE data.js
============================================================ */