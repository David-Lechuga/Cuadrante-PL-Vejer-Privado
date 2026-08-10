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
         * usuarios es la variable global definida en data.js.
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
     * Cargar usuarios.
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
     * Comprobar si existe una sesión guardada.
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

                usuarioActual = {

                    id:
                        sesion.id || "",

                    nombre:
                        sesion.nombre,

                    tipo:
                        sesion.tipo

                };


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

        }


        sessionStorage.removeItem(
            "usuarioActual"
        );

    }


    /*
     * No existe sesión.
     */

    mostrarLogin();

}


/* ============================================================
   INICIAR SESIÓN
============================================================ */

/*
 * IMPORTANTE:
 *
 * Esta función NO llama a validarAcceso().
 *
 * El app.js actual tiene una función validarAcceso()
 * que termina llamando a iniciarSesion().
 *
 * Si iniciarSesion() llamara de nuevo a validarAcceso(),
 * se produciría una recursión infinita.
 */

async function iniciarSesion() {

    console.log(
        "iniciarSesion()"
    );


    const campoPassword =
        document.getElementById(
            "loginPassword"
        );


    if (!campoPassword) {

        console.error(
            "No existe el campo loginPassword."
        );

        return;

    }


    const password =
        campoPassword.value.trim();


    /*
     * Comprobar contraseña vacía.
     */

    if (!password) {

        mostrarErrorLogin(
            "Introduzca la contraseña."
        );

        campoPassword.focus();

        return;

    }


    /*
     * Asegurarnos de que los usuarios están cargados.
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
     * Buscar usuario por contraseña.
     */

    const encontrado =
        obtenerUsuarioPorPassword(
            password
        );


    /*
     * Contraseña incorrecta.
     */

    if (!encontrado) {

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
     * Crear sesión.
     *
     * La contraseña NO se guarda.
     */

    usuarioActual = {

        id:
            encontrado.id,

        nombre:
            encontrado.nombre,

        tipo:
            encontrado.tipo

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
     * Actualizar interfaz.
     */

    actualizarInterfazUsuario();


    /*
     * Mostrar el día actual si la función existe.
     */

    if (
        typeof irAHoy === "function"
    ) {

        irAHoy();

    }

}


/* ============================================================
   VALIDAR ACCESO
============================================================ */

/*
 * Esta función se mantiene porque el HTML actual puede
 * llamar directamente a validarAcceso().
 *
 * NO llama a validarAcceso() otra vez.
 * Tampoco llama a iniciarSesion() directamente si el
 * app.js ya dispone de su propia función.
 */

async function validarAcceso() {

    console.log(
        "validarAcceso()"
    );


    /*
     * Si app.js dispone de su propia función validarAcceso,
     * esta función puede ser sustituida posteriormente.
     *
     * Para evitar recursiones, aquí hacemos directamente
     * el proceso de autenticación.
     */

    const campoPassword =
        document.getElementById(
            "loginPassword"
        );


    if (!campoPassword) {

        console.error(
            "No existe el campo loginPassword."
        );

        return;

    }


    const password =
        campoPassword.value.trim();


    if (!password) {

        mostrarErrorLogin(
            "Introduzca la contraseña."
        );

        campoPassword.focus();

        return;

    }


    /*
     * Cargar usuarios si todavía no están disponibles.
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
     * Buscar usuario.
     */

    const encontrado =
        obtenerUsuarioPorPassword(
            password
        );


    if (!encontrado) {

        mostrarErrorLogin(
            "Contraseña incorrecta."
        );

        campoPassword.value = "";

        campoPassword.focus();

        return;

    }


    /*
     * Crear sesión.
     */

    usuarioActual = {

        id:
            encontrado.id,

        nombre:
            encontrado.nombre,

        tipo:
            encontrado.tipo

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


    campoPassword.value = "";


    mostrarAplicacion();

    actualizarInterfazUsuario();


    if (
        typeof irAHoy === "function"
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
     * Mostrar nombre del usuario si existe
     * algún elemento preparado para ello.
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
     *
     * Cualquier elemento HTML con:
     *
     * data-admin-only
     *
     * solo será visible para el administrador.
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
        );


    if (campoPassword) {

        campoPassword.value = "";

        campoPassword.focus();

    }


    /*
     * Limpiar mensajes de error.
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
     * Compatibilidad con versiones anteriores.
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