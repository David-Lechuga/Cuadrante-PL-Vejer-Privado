/* ============================================================
   AUTENTICACIÓN
   Cuadrante Policía Local Vejer
============================================================ */

let usuarios = {};
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

        usuarios = await respuesta.json();

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

        throw error;

    }

}


/* ============================================================
   INICIALIZAR AUTENTICACIÓN
============================================================ */

async function inicializarAutenticacion() {

    try {

        await cargarUsuarios();

        /*
         * Comprobar si existe una sesión guardada.
         */

        const sesionGuardada =
            sessionStorage.getItem(
                "usuarioActual"
            );


        if (sesionGuardada) {

            try {

                const usuario =
                    JSON.parse(
                        sesionGuardada
                    );

                if (
                    usuario &&
                    usuario.nombre &&
                    usuario.tipo
                ) {

                    usuarioActual =
                        usuario;

                    mostrarAplicacion();

                    actualizarInterfazUsuario();

                    return;

                }

            } catch (error) {

                console.warn(
                    "Sesión guardada no válida."
                );

            }

        }


        mostrarLogin();

    } catch (error) {

        console.error(
            "No se pudo inicializar la autenticación:",
            error
        );

        mostrarLogin();

        mostrarErrorLogin(
            "No se ha podido cargar la información de usuarios."
        );

    }

}


/* ============================================================
   VALIDAR ACCESO
============================================================ */

/*
 * El login solamente solicita la contraseña.
 *
 * La contraseña identifica automáticamente al usuario.
 */

async function validarAcceso() {

    const campoPassword =
        document.getElementById(
            "loginPassword"
        );


    const campoPasswordAntiguo =
        document.getElementById(
            "password"
        );


    const password =
        (
            campoPassword?.value ??
            campoPasswordAntiguo?.value ??
            ""
        ).trim();


    if (!password) {

        mostrarErrorLogin(
            "Introduzca la contraseña."
        );

        return;

    }


    /*
     * Si todavía no se han cargado los usuarios,
     * intentamos cargarlos.
     */

    if (
        !usuarios ||
        Object.keys(usuarios).length === 0
    ) {

        try {

            await cargarUsuarios();

        } catch (error) {

            mostrarErrorLogin(
                "No se ha podido cargar la lista de usuarios."
            );

            return;

        }

    }


    /*
     * Buscar usuario por contraseña.
     */

    let encontrado = null;


    for (
        const clave in usuarios
    ) {

        const usuario =
            usuarios[clave];


        if (
            usuario &&
            String(usuario.password).trim() ===
            password
        ) {

            encontrado = {
                id: clave,
                nombre: usuario.nombre,
                tipo: usuario.tipo,
                password: usuario.password
            };

            break;

        }

    }


    /*
     * Contraseña incorrecta.
     */

    if (!encontrado) {

        mostrarErrorLogin(
            "Contraseña incorrecta."
        );

        if (campoPassword) {

            campoPassword.value = "";

            campoPassword.focus();

        }

        return;

    }


    /*
     * Guardar usuario actual.
     *
     * No guardamos la contraseña en la sesión.
     */

    usuarioActual = {

        id: encontrado.id,

        nombre: encontrado.nombre,

        tipo: encontrado.tipo

    };


    sessionStorage.setItem(
        "usuarioActual",
        JSON.stringify(
            usuarioActual
        )
    );


    /*
     * Limpiar contraseña.
     */

    if (campoPassword) {

        campoPassword.value = "";

    }


    /*
     * Mostrar aplicación.
     */

    mostrarAplicacion();

    actualizarInterfazUsuario();


    /*
     * Cargar el día actual.
     */

    if (
        typeof irAHoy ===
        "function"
    ) {

        irAHoy();

    }

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
     * Buscar posibles elementos donde mostrar
     * el usuario actual.
     */

    const elementosNombre = [

        "usuarioActual",
        "nombreUsuario",
        "usuarioLogueado"

    ];


    elementosNombre.forEach(
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
     * Mostrar u ocultar elementos específicos
     * del administrador.
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
     * Marcar el tipo de usuario en el body.
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
   OBTENER NOMBRE DEL USUARIO
============================================================ */

function obtenerNombreUsuarioActual() {

    return usuarioActual
        ? usuarioActual.nombre
        : "";

}


/* ============================================================
   COMPROBAR SI ES ADMINISTRADOR
============================================================ */

function esAdministrador() {

    return !!(
        usuarioActual &&
        usuarioActual.tipo === "admin"
    );

}


/* ============================================================
   COMPROBAR SI ES AGENTE
============================================================ */

function esAgente() {

    return !!(
        usuarioActual &&
        usuarioActual.tipo === "agente"
    );

}


/* ============================================================
   CERRAR SESIÓN
============================================================ */

function cerrarSesion() {

    usuarioActual =
        null;


    sessionStorage.removeItem(
        "usuarioActual"
    );


    mostrarLogin();


    /*
     * Limpiar posibles mensajes de error.
     */

    const error =
        document.getElementById(
            "loginError"
        );


    if (error) {

        error.textContent = "";

    }


    /*
     * Limpiar contraseña.
     */

    const password =
        document.getElementById(
            "loginPassword"
        );


    if (password) {

        password.value = "";

        password.focus();

    }


    console.log(
        "Sesión cerrada."
    );

}


/* ============================================================
   ERROR DE LOGIN
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
     * Compatibilidad con la interfaz antigua.
     */

    const errorAntiguo =
        document.getElementById(
            "errorLogin"
        );


    if (errorAntiguo) {

        errorAntiguo.textContent =
            mensaje;

    }

}


/* ============================================================
   COMPATIBILIDAD
============================================================ */

/*
 * Algunas partes antiguas de la aplicación pueden
 * consultar estas funciones.
 */

function obtenerAgenteActual() {

    if (!usuarioActual) {

        return "";

    }


    return usuarioActual.nombre;

}


function obtenerTipoUsuario() {

    if (!usuarioActual) {

        return "";

    }


    return usuarioActual.tipo;

}


/* ============================================================
   FIN AUTH.JS
============================================================ */