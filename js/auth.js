/* ============================================================
   AUTENTICACIÓN
   CUADRANTE POLICÍA LOCAL VEJER
============================================================ */

let usuarioActual = null;


/* ============================================================
   CARGAR USUARIOS
============================================================ */

async function cargarUsuarios() {

    try {

        const respuesta = await fetch(
            `usuarios.json?t=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                `No se pudo cargar usuarios.json (${respuesta.status})`
            );

        }

        const datos = await respuesta.json();

        /*
         * usuarios es la variable global definida en data.js
         */

        usuarios = datos || {};

        console.log(
            "Usuarios cargados correctamente:",
            Object.keys(usuarios).length
        );

        return true;

    } catch (error) {

        console.error(
            "Error cargando usuarios.json:",
            error
        );

        usuarios = {};

        return false;

    }

}


/* ============================================================
   INICIALIZAR AUTENTICACIÓN
============================================================ */

async function inicializarAutenticacion() {

    console.log(
        "Inicializando autenticación..."
    );

    /*
     * Intentamos cargar los usuarios.
     */

    const usuariosOK =
        await cargarUsuarios();


    if (!usuariosOK) {

        console.error(
            "No se pudieron cargar los usuarios."
        );

        mostrarLogin();

        mostrarErrorLogin(
            "No se ha podido cargar la información de usuarios."
        );

        return;

    }


    /*
     * Comprobar si existe una sesión anterior.
     */

    const sesionGuardada =
        sessionStorage.getItem(
            "usuarioActual"
        );


    if (sesionGuardada) {

        try {

            const sesion =
                JSON.parse(
                    sesionGuardada
                );


            if (
                sesion &&
                sesion.nombre &&
                sesion.tipo
            ) {

                usuarioActual =
                    sesion;


                console.log(
                    "Sesión recuperada:",
                    usuarioActual
                );


                mostrarAplicacion();

                actualizarInterfazUsuario();

                return;

            }

        } catch (error) {

            console.warn(
                "La sesión guardada no es válida."
            );

            sessionStorage.removeItem(
                "usuarioActual"
            );

        }

    }


    /*
     * No hay sesión.
     */

    mostrarLogin();

}


/* ============================================================
   VALIDAR ACCESO
============================================================ */

async function validarAcceso() {

    console.log(
        "Validando acceso..."
    );


    /*
     * Buscar el campo de contraseña.
     *
     * Compatibilidad con diferentes versiones del HTML.
     */

    const campoPassword =
        document.getElementById(
            "loginPassword"
        ) ||
        document.getElementById(
            "password"
        );


    if (!campoPassword) {

        console.error(
            "No existe el campo de contraseña."
        );

        return;

    }


    const password =
        campoPassword.value.trim();


    /*
     * Comprobar que se ha introducido algo.
     */

    if (!password) {

        mostrarErrorLogin(
            "Introduzca la contraseña."
        );

        campoPassword.focus();

        return;

    }


    /*
     * Si los usuarios todavía no están cargados,
     * los cargamos ahora.
     */

    if (
        !usuarios ||
        typeof usuarios !== "object" ||
        Object.keys(usuarios).length === 0
    ) {

        const cargados =
            await cargarUsuarios();


        if (!cargados) {

            mostrarErrorLogin(
                "No se ha podido cargar la lista de usuarios."
            );

            return;

        }

    }


    /*
     * Buscar al usuario mediante su contraseña.
     */

    let usuarioEncontrado = null;


    for (
        const clave in usuarios
    ) {

        const usuario =
            usuarios[clave];


        if (!usuario) {

            continue;

        }


        if (
            String(
                usuario.password || ""
            ).trim() === password
        ) {

            usuarioEncontrado = {

                id:
                    clave,

                nombre:
                    usuario.nombre,

                tipo:
                    usuario.tipo

            };

            break;

        }

    }


    /*
     * Contraseña incorrecta.
     */

    if (!usuarioEncontrado) {

        console.warn(
            "Contraseña incorrecta."
        );

        mostrarErrorLogin(
            "Contraseña incorrecta."
        );

        campoPassword.value = "";

        campoPassword.focus();

        return;

    }


    /*
     * Guardamos el usuario identificado.
     *
     * NO guardamos la contraseña.
     */

    usuarioActual = {

        id:
            usuarioEncontrado.id,

        nombre:
            usuarioEncontrado.nombre,

        tipo:
            usuarioEncontrado.tipo

    };


    sessionStorage.setItem(
        "usuarioActual",
        JSON.stringify(
            usuarioActual
        )
    );


    console.log(
        "Usuario identificado:",
        usuarioActual
    );


    /*
     * Limpiar contraseña.
     */

    campoPassword.value = "";


    /*
     * Mostrar aplicación.
     */

    mostrarAplicacion();


    /*
     * Actualizar elementos de usuario.
     */

    actualizarInterfazUsuario();


    /*
     * Si existe la función irAHoy(),
     * mostramos el día actual.
     */

    if (
        typeof irAHoy === "function"
    ) {

        irAHoy();

    }

}


/* ============================================================
   COMPATIBILIDAD CON EL APP.JS ACTUAL
============================================================ */

/*
 * El app.js que tenemos actualmente todavía llama
 * a iniciarSesion().
 *
 * Mantenemos esta función para no tener que modificar
 * el app.js en este momento.
 */

async function iniciarSesion() {

    console.log(
        "iniciarSesion() → validarAcceso()"
    );

    return await validarAcceso();

}


/* ============================================================
   MOSTRAR LOGIN
============================================================ */

function mostrarLogin() {

    const login =
        document.getElementById(
            "loginScreen"
        );


    const aplicacion =
        document.getElementById(
            "appContent"
        );


    if (login) {

        login.classList.remove(
            "hidden"
        );

    }


    if (aplicacion) {

        aplicacion.classList.add(
            "hidden"
        );

    }

}


/* ============================================================
   MOSTRAR APLICACIÓN
============================================================ */

function mostrarAplicacion() {

    const login =
        document.getElementById(
            "loginScreen"
        );


    const aplicacion =
        document.getElementById(
            "appContent"
        );


    if (login) {

        login.classList.add(
            "hidden"
        );

    }


    if (aplicacion) {

        aplicacion.classList.remove(
            "hidden"
        );

    }

}


/* ============================================================
   ACTUALIZAR INTERFAZ DEL USUARIO
============================================================ */

function actualizarInterfazUsuario() {

    if (!usuarioActual) {

        return;

    }


    /*
     * Posibles elementos del HTML donde mostrar
     * el nombre del usuario.
     */

    const idsNombre = [

        "usuarioActual",
        "nombreUsuario",
        "usuarioLogueado"

    ];


    idsNombre.forEach(
        id => {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.textContent =
                    usuarioActual.nombre;

            }

        }
    );


    /*
     * Elementos exclusivos del administrador.
     */

    const elementosAdmin =
        document.querySelectorAll(
            "[data-admin-only]"
        );


    elementosAdmin.forEach(
        elemento => {

            if (
                usuarioActual.tipo ===
                "admin"
            ) {

                elemento.classList.remove(
                    "hidden"
                );

            } else {

                elemento.classList.add(
                    "hidden"
                );

            }

        }
    );


    /*
     * Guardar el tipo de usuario en el body.
     */

    document.body.dataset.usuarioTipo =
        usuarioActual.tipo;

}


/* ============================================================
   OBTENER USUARIO ACTUAL
============================================================ */

function obtenerUsuarioActual() {

    return usuarioActual;

}


/* ============================================================
   OBTENER NOMBRE DEL USUARIO ACTUAL
============================================================ */

function obtenerNombreUsuarioActual() {

    if (!usuarioActual) {

        return "";

    }


    return usuarioActual.nombre;

}


/* ============================================================
   OBTENER TIPO DE USUARIO
============================================================ */

function obtenerTipoUsuario() {

    if (!usuarioActual) {

        return "";

    }


    return usuarioActual.tipo;

}


/* ============================================================
   COMPROBAR ADMINISTRADOR
============================================================ */

function esAdministrador() {

    return !!(
        usuarioActual &&
        usuarioActual.tipo === "admin"
    );

}


/* ============================================================
   COMPROBAR AGENTE
============================================================ */

function esAgente() {

    return !!(
        usuarioActual &&
        usuarioActual.tipo === "agente"
    );

}


/* ============================================================
   OBTENER AGENTE ACTUAL
============================================================ */

function obtenerAgenteActual() {

    if (!usuarioActual) {

        return "";

    }


    return usuarioActual.nombre;

}


/* ============================================================
   CERRAR SESIÓN
============================================================ */

function cerrarSesion() {

    console.log(
        "Cerrando sesión..."
    );


    usuarioActual =
        null;


    sessionStorage.removeItem(
        "usuarioActual"
    );


    /*
     * Mostrar login.
     */

    mostrarLogin();


    /*
     * Limpiar contraseña.
     */

    const campoPassword =
        document.getElementById(
            "loginPassword"
        ) ||
        document.getElementById(
            "password"
        );


    if (campoPassword) {

        campoPassword.value = "";

        campoPassword.focus();

    }


    /*
     * Limpiar posibles mensajes.
     */

    const elementosError = [

        "loginError",
        "errorLogin"

    ];


    elementosError.forEach(
        id => {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.textContent = "";

            }

        }
    );

}


/* ============================================================
   MOSTRAR ERROR DE LOGIN
============================================================ */

function mostrarErrorLogin(
    mensaje
) {

    const elemento =
        document.getElementById(
            "loginError"
        );


    if (elemento) {

        elemento.textContent =
            mensaje;

        return;

    }


    /*
     * Compatibilidad con HTML anterior.
     */

    const elementoAntiguo =
        document.getElementById(
            "errorLogin"
        );


    if (elementoAntiguo) {

        elementoAntiguo.textContent =
            mensaje;

    }

}


/* ============================================================
   FIN AUTH.JS
============================================================ */

console.log(
    "auth.js cargado correctamente"
);