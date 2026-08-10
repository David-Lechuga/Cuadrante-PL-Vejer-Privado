/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   AUTENTICACIÓN Y GESTIÓN DE USUARIO
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   USUARIO ACTUAL
============================================================ */

/*
   Esta variable contiene el usuario que actualmente
   está utilizando la aplicación.

   Puede ser:

   - un agente
   - el administrador
   - null si nadie ha iniciado sesión
*/

let usuarioActual = null;


/* ============================================================
   INICIAR SESIÓN
============================================================ */

async function iniciarSesion() {

    const campoPassword =
        obtenerElemento("password");

    if (!campoPassword) {

        console.error(
            "No se encontró el campo de contraseña."
        );

        return;

    }

    const password =
        campoPassword.value.trim();

    if (!password) {

        mostrarErrorLogin(
            "Contraseña incorrecta."
        );

        return;

    }


    /*
       Si los usuarios todavía no están cargados,
       intentamos cargarlos.
    */

    if (!Array.isArray(usuarios) || !usuarios.length) {

        const resultado =
            await cargarUsuarios();

        if (!resultado) {

            mostrarErrorLogin(
                "No se pudo comprobar el acceso."
            );

            return;

        }

    }


    /*
       Buscamos la contraseña en usuarios.json.
    */

    const usuario =
        obtenerUsuarioPorPassword(
            password
        );


    /*
       Contraseña incorrecta.
    */

    if (!usuario) {

        mostrarErrorLogin(
            TEXTOS.contraseñaIncorrecta
        );

        campoPassword.value = "";

        campoPassword.focus();

        return;

    }


    /*
       Normalizamos el tipo de usuario.
    */

    const tipo =
        normalizarTipoUsuario(
            usuario.tipo
        );


    /*
       Si el JSON contiene un usuario sin tipo
       válido, no permitimos el acceso.
    */

    if (!tipo) {

        console.error(
            "El usuario no tiene un tipo válido:",
            usuario
        );

        mostrarErrorLogin(
            TEXTOS.contraseñaIncorrecta
        );

        campoPassword.value = "";

        return;

    }


    /*
       Creamos una copia limpia del usuario.

       IMPORTANTE:
       No guardamos la contraseña en localStorage.
    */

    usuarioActual = {

        nombre:
            usuario.nombre || "",

        tipo:
            tipo

    };


    /*
       Guardamos la sesión.
    */

    guardarUsuarioLocal(
        usuarioActual
    );


    /*
       Limpiamos el campo de contraseña.
    */

    campoPassword.value = "";


    /*
       Eliminamos cualquier mensaje de error.
    */

    ocultarErrorLogin();


    /*
       Pasamos a la aplicación.
    */

    mostrarAplicacion();

}


/* ============================================================
   NORMALIZAR TIPO DE USUARIO
============================================================ */

function normalizarTipoUsuario(tipo) {

    const valor =
        normalizarTexto(tipo)
            .toLowerCase();


    if (
        valor ===
        TIPOS_USUARIO.ADMIN
    ) {

        return TIPOS_USUARIO.ADMIN;

    }


    if (
        valor ===
        TIPOS_USUARIO.AGENTE
    ) {

        return TIPOS_USUARIO.AGENTE;

    }


    return null;

}


/* ============================================================
   COMPROBAR SI ES ADMINISTRADOR
============================================================ */

function esAdministrador() {

    return (

        usuarioActual !== null &&

        usuarioActual.tipo ===
            TIPOS_USUARIO.ADMIN

    );

}


/* ============================================================
   COMPROBAR SI ES AGENTE
============================================================ */

function esAgente() {

    return (

        usuarioActual !== null &&

        usuarioActual.tipo ===
            TIPOS_USUARIO.AGENTE

    );

}


/* ============================================================
   OBTENER NOMBRE DEL USUARIO ACTUAL
============================================================ */

function obtenerNombreUsuarioActual() {

    if (!usuarioActual) {

        return "";

    }

    return usuarioActual.nombre || "";

}


/* ============================================================
   OBTENER TIPO DEL USUARIO ACTUAL
============================================================ */

function obtenerTipoUsuarioActual() {

    if (!usuarioActual) {

        return null;

    }

    return usuarioActual.tipo || null;

}


/* ============================================================
   MOSTRAR APLICACIÓN
============================================================ */

function mostrarAplicacion() {

    const pantallaLogin =
        obtenerElemento("pantallaLogin");

    const aplicacion =
        obtenerElemento("aplicacion");

    if (pantallaLogin) {

        ocultarElemento(
            pantallaLogin
        );

    }

    if (aplicacion) {

        mostrarElemento(
            aplicacion
        );

    }


    /*
       Actualizamos información relacionada
       con el usuario.
    */

    actualizarInterfazUsuario();

}


/* ============================================================
   MOSTRAR PANTALLA DE LOGIN
============================================================ */

function mostrarPantallaLogin() {

    const pantallaLogin =
        obtenerElemento("pantallaLogin");

    const aplicacion =
        obtenerElemento("aplicacion");


    if (aplicacion) {

        ocultarElemento(
            aplicacion
        );

    }

    if (pantallaLogin) {

        mostrarElemento(
            pantallaLogin
        );

    }


    const campoPassword =
        obtenerElemento("password");

    if (campoPassword) {

        campoPassword.value = "";

        setTimeout(
            () => campoPassword.focus(),
            100
        );

    }


    ocultarErrorLogin();

}


/* ============================================================
   MOSTRAR ERROR DE LOGIN
============================================================ */

function mostrarErrorLogin(mensaje) {

    let elemento =
        obtenerElemento(
            "errorLogin"
        );


    /*
       Si el HTML todavía no contiene
       el elemento, intentamos crearlo.
    */

    if (!elemento) {

        const campoPassword =
            obtenerElemento("password");

        if (!campoPassword) {

            return;

        }

        elemento =
            document.createElement(
                "div"
            );

        elemento.id =
            "errorLogin";

        elemento.className =
            "text-red-600 text-center mt-3 font-semibold";

        campoPassword
            .parentElement
            ?.appendChild(elemento);

    }


    elemento.textContent =
        mensaje || TEXTOS.contraseñaIncorrecta;


    mostrarElemento(
        elemento
    );

}


/* ============================================================
   OCULTAR ERROR DE LOGIN
============================================================ */

function ocultarErrorLogin() {

    const elemento =
        obtenerElemento(
            "errorLogin"
        );

    if (!elemento) {

        return;

    }

    ocultarElemento(
        elemento
    );

}


/* ============================================================
   ACTUALIZAR INTERFAZ DEL USUARIO
============================================================ */

function actualizarInterfazUsuario() {

    /*
       Esta función no construye todavía la pantalla.

       Simplemente comunica al resto de la aplicación
       quién ha iniciado sesión.

       El renderizado completo lo haremos posteriormente
       en render.js.
    */


    const elementoUsuario =
        obtenerElemento(
            "usuarioActual"
        );


    if (!elementoUsuario) {

        return;

    }


    if (esAdministrador()) {

        elementoUsuario.textContent =
            "ADMINISTRADOR";

        return;

    }


    if (esAgente()) {

        elementoUsuario.textContent =
            obtenerNombreUsuarioActual();

    }

}


/* ============================================================
   RECUPERAR SESIÓN
============================================================ */

function recuperarSesion() {

    if (!existeSesionGuardada()) {

        usuarioActual = null;

        return false;

    }


    const usuario =
        recuperarUsuarioLocal();


    if (!usuario) {

        eliminarSesionLocal();

        usuarioActual = null;

        return false;

    }


    const tipo =
        normalizarTipoUsuario(
            usuario.tipo
        );


    /*
       Si la información almacenada no es válida,
       eliminamos la sesión.
    */

    if (
        !usuario.nombre ||
        !tipo
    ) {

        eliminarSesionLocal();

        usuarioActual = null;

        return false;

    }


    /*
       Recuperamos únicamente nombre y tipo.
    */

    usuarioActual = {

        nombre:
            usuario.nombre,

        tipo:
            tipo

    };


    return true;

}


/* ============================================================
   CAMBIAR DE AGENTE
============================================================ */

/*
   Tanto el administrador como un agente podrán
   utilizar esta función.

   No cerramos completamente la aplicación.
   Simplemente eliminamos la sesión actual y
   volvemos a la pantalla de acceso.
*/

function cambiarAgente() {

    const confirmar =
        confirm(
            "¿Desea cambiar de agente?"
        );


    if (!confirmar) {

        return;

    }


    eliminarSesionLocal();

    usuarioActual = null;


    /*
       Cerramos cualquier menú o modal abierto.
    */

    cerrarTodosLosModales();


    /*
       Volvemos al login.
    */

    mostrarPantallaLogin();

}


/* ============================================================
   CERRAR SESIÓN
============================================================ */

function cerrarSesion() {

    const confirmar =
        confirm(
            "¿Desea cerrar la sesión?"
        );


    if (!confirmar) {

        return;

    }


    eliminarSesionLocal();

    usuarioActual = null;


    cerrarTodosLosModales();


    mostrarPantallaLogin();

}


/* ============================================================
   COMPROBAR AUTENTICACIÓN
============================================================ */

function usuarioAutenticado() {

    return (
        usuarioActual !== null
    );

}


/* ============================================================
   COMPROBAR PERMISOS DE ADMINISTRADOR
============================================================ */

function puedeVerTodosLosAgentes() {

    return esAdministrador();

}


/* ============================================================
   COMPROBAR PERMISOS DE AGENTE
============================================================ */

function puedeVerSoloPropioTurno() {

    return esAgente();

}


/* ============================================================
   VALIDAR ACCESO A LA APLICACIÓN
============================================================ */

function validarAcceso() {

    if (
        usuarioAutenticado()
    ) {

        mostrarAplicacion();

        return true;

    }


    mostrarPantallaLogin();

    return false;

}


/* ============================================================
   INICIALIZAR AUTENTICACIÓN
============================================================ */

function inicializarAutenticacion() {

    /*
       Intentamos recuperar la sesión almacenada.
    */

    const sesion =
        recuperarSesion();


    if (sesion) {

        console.log(
            "Sesión recuperada:",
            usuarioActual
        );

        mostrarAplicacion();

        return true;

    }


    /*
       No existe sesión.
       Mostramos el login.
    */

    mostrarPantallaLogin();

    return false;

}


/* ============================================================
   EVENTO ENTER EN CONTRASEÑA
============================================================ */

function activarEventoPassword() {

    const campoPassword =
        obtenerElemento("password");


    if (!campoPassword) {

        return;

    }


    /*
       Evitamos registrar el evento dos veces.
    */

    if (
        campoPassword.dataset
            .eventoActivo === "true"
    ) {

        return;

    }


    campoPassword.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                iniciarSesion();

            }

        }
    );


    campoPassword.dataset
        .eventoActivo = "true";

}


/* ============================================================
   FIN DE auth.js
============================================================ */