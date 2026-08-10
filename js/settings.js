/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   AJUSTES Y CAMBIO DE USUARIO
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   MOSTRAR MENÚ DE AJUSTES
============================================================ */

function mostrarMenuAjustes() {

    cerrarTodosLosModales();

    const menuAnterior =
        document.getElementById("menuAjustes");

    if (menuAnterior) {
        menuAnterior.remove();
    }


    const fondo =
        document.createElement("div");

    fondo.id =
        "menuAjustes";

    fondo.className =
        "fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4";


    const contenido =
        document.createElement("div");

    contenido.className =
        "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden";


    /* ========================================================
       CABECERA
    ======================================================== */

    const cabecera =
        document.createElement("div");

    cabecera.className =
        "bg-[#0A2342] text-white px-6 py-5";


    const titulo =
        document.createElement("h2");

    titulo.className =
        "text-2xl font-bold text-center";

    titulo.textContent =
        "⚙️ Ajustes";


    cabecera.appendChild(
        titulo
    );


    /* ========================================================
       INFORMACIÓN DEL USUARIO
    ======================================================== */

    const usuario =
        obtenerUsuarioActual();


    const informacion =
        document.createElement("div");

    informacion.className =
        "px-6 py-4 border-b border-gray-200 text-center";


    const nombre =
        document.createElement("div");

    nombre.className =
        "font-bold text-[#0A2342] text-lg";

    nombre.textContent =
        usuario?.nombre ||
        obtenerNombreUsuarioActual() ||
        "Usuario";


    const tipo =
        document.createElement("div");

    tipo.className =
        "text-sm text-gray-500 mt-1";

    tipo.textContent =
        esAdministrador()
            ? "Administrador"
            : "Agente";


    informacion.appendChild(
        nombre
    );

    informacion.appendChild(
        tipo
    );


    /* ========================================================
       BOTONES
    ======================================================== */

    const botones =
        document.createElement("div");

    botones.className =
        "p-6 space-y-3";


    /* --------------------------------------------------------
       CAMBIAR AGENTE / USUARIO
    -------------------------------------------------------- */

    const botonCambiar =
        crearBotonAjustes(
            "🔄",
            "Cambiar agente",
            () => {

                cerrarMenuAjustes();

                mostrarSelectorUsuarios();

            }
        );


    /* --------------------------------------------------------
       INFORMACIÓN
    -------------------------------------------------------- */

    const botonInformacion =
        crearBotonAjustes(
            "ℹ️",
            "Información",
            () => {

                cerrarMenuAjustes();

                mostrarInformacion();

            }
        );


    /* --------------------------------------------------------
       CERRAR SESIÓN
    -------------------------------------------------------- */

    const botonCerrarSesion =
        crearBotonAjustes(
            "🚪",
            "Cerrar sesión",
            () => {

                cerrarMenuAjustes();

                cerrarSesion();

            }
        );


    /* --------------------------------------------------------
       CANCELAR
    -------------------------------------------------------- */

    const botonCancelar =
        crearBotonAjustes(
            "✖️",
            "Cancelar",
            () => {

                cerrarMenuAjustes();

            }
        );


    botones.appendChild(
        botonCambiar
    );

    botones.appendChild(
        botonInformacion
    );

    botones.appendChild(
        botonCerrarSesion
    );

    botones.appendChild(
        botonCancelar
    );


    contenido.appendChild(
        cabecera
    );

    contenido.appendChild(
        informacion
    );

    contenido.appendChild(
        botones
    );

    fondo.appendChild(
        contenido
    );


    /* ========================================================
       CERRAR AL PULSAR FUERA
    ======================================================== */

    fondo.addEventListener(
        "click",
        event => {

            if (
                event.target === fondo
            ) {

                cerrarMenuAjustes();

            }

        }
    );


    document.body.appendChild(
        fondo
    );

}


/* ============================================================
   CREAR BOTÓN DE AJUSTES
============================================================ */

function crearBotonAjustes(
    icono,
    texto,
    accion
) {

    const boton =
        document.createElement("button");

    boton.type =
        "button";

    boton.className =
        "w-full flex items-center gap-4 " +
        "bg-gray-50 hover:bg-gray-100 " +
        "border border-gray-200 " +
        "rounded-xl px-4 py-4 " +
        "text-left transition";


    const iconoElemento =
        document.createElement("span");

    iconoElemento.className =
        "text-2xl w-8 text-center";

    iconoElemento.textContent =
        icono;


    const textoElemento =
        document.createElement("span");

    textoElemento.className =
        "font-semibold text-gray-800";

    textoElemento.textContent =
        texto;


    boton.appendChild(
        iconoElemento
    );

    boton.appendChild(
        textoElemento
    );


    boton.addEventListener(
        "click",
        accion
    );


    return boton;

}


/* ============================================================
   CERRAR MENÚ DE AJUSTES
============================================================ */

function cerrarMenuAjustes() {

    const menu =
        document.getElementById(
            "menuAjustes"
        );


    if (menu) {

        menu.remove();

    }

}


/* ============================================================
   SELECTOR DE USUARIOS
============================================================ */

function mostrarSelectorUsuarios() {

    cerrarTodosLosModales();


    const anterior =
        document.getElementById(
            "selectorUsuarios"
        );


    if (anterior) {

        anterior.remove();

    }


    const fondo =
        document.createElement("div");

    fondo.id =
        "selectorUsuarios";

    fondo.className =
        "fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4";


    const contenido =
        document.createElement("div");

    contenido.className =
        "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden";


    /* ========================================================
       CABECERA
    ======================================================== */

    const cabecera =
        document.createElement("div");

    cabecera.className =
        "bg-[#0A2342] text-white px-6 py-5";


    const titulo =
        document.createElement("h2");

    titulo.className =
        "text-2xl font-bold text-center";

    titulo.textContent =
        "🔄 Cambiar agente";


    cabecera.appendChild(
        titulo
    );


    /* ========================================================
       LISTA
    ======================================================== */

    const lista =
        document.createElement("div");

    lista.className =
        "p-6 max-h-[60vh] overflow-y-auto space-y-2";


    const usuarios =
        obtenerUsuariosDisponibles();


    if (
        !usuarios.length
    ) {

        lista.innerHTML = `

            <div class="text-center
                        text-gray-500
                        py-6">

                No hay usuarios disponibles.

            </div>

        `;

    } else {

        usuarios.forEach(
            usuario => {

                const boton =
                    document.createElement(
                        "button"
                    );

                boton.type =
                    "button";

                boton.className =
                    "w-full text-left " +
                    "bg-gray-50 hover:bg-gray-100 " +
                    "border border-gray-200 " +
                    "rounded-xl px-4 py-3 " +
                    "transition";


                const nombre =
                    document.createElement(
                        "div"
                    );

                nombre.className =
                    "font-semibold text-gray-800";

                nombre.textContent =
                    usuario.nombre ||
                    usuario.usuario ||
                    "Usuario";


                const descripcion =
                    document.createElement(
                        "div"
                    );

                descripcion.className =
                    "text-sm text-gray-500";

                descripcion.textContent =
                    usuario.tipo === "admin"
                        ? "Administrador"
                        : "Agente";


                boton.appendChild(
                    nombre
                );

                boton.appendChild(
                    descripcion
                );


                boton.addEventListener(
                    "click",
                    () => {

                        seleccionarUsuario(
                            usuario
                        );

                    }
                );


                lista.appendChild(
                    boton
                );

            }
        );

    }


    /* ========================================================
       BOTÓN CANCELAR
    ======================================================== */

    const pie =
        document.createElement("div");

    pie.className =
        "px-6 pb-6";


    const cancelar =
        crearBotonAjustes(
            "✖️",
            "Cancelar",
            () => {

                cerrarSelectorUsuarios();

            }
        );


    pie.appendChild(
        cancelar
    );


    contenido.appendChild(
        cabecera
    );

    contenido.appendChild(
        lista
    );

    contenido.appendChild(
        pie
    );

    fondo.appendChild(
        contenido
    );


    fondo.addEventListener(
        "click",
        event => {

            if (
                event.target === fondo
            ) {

                cerrarSelectorUsuarios();

            }

        }
    );


    document.body.appendChild(
        fondo
    );

}


/* ============================================================
   OBTENER USUARIOS DISPONIBLES
============================================================ */

function obtenerUsuariosDisponibles() {

    /*
       El administrador debe poder cambiar a cualquier
       usuario.

       Los agentes también podrán seleccionar otro agente
       si la aplicación privada lo permite.

       Los datos se obtienen de la estructura cargada
       mediante data.js.
    */

    if (
        typeof obtenerUsuarios ===
        "function"
    ) {

        const usuarios =
            obtenerUsuarios();

        if (
            Array.isArray(usuarios)
        ) {

            return usuarios;

        }

    }


    /*
       Compatibilidad con diferentes estructuras
       de data.js.
    */

    if (
        typeof usuariosDisponibles !==
        "undefined" &&
        Array.isArray(
            usuariosDisponibles
        )
    ) {

        return usuariosDisponibles;

    }


    return [];

}


/* ============================================================
   SELECCIONAR USUARIO
============================================================ */

function seleccionarUsuario(
    usuario
) {

    cerrarSelectorUsuarios();


    if (
        typeof cambiarUsuario ===
        "function"
    ) {

        cambiarUsuario(
            usuario
        );

        return;

    }


    /*
       Compatibilidad con auth.js.
    */

    if (
        typeof iniciarSesionComo ===
        "function"
    ) {

        iniciarSesionComo(
            usuario
        );

        return;

    }


    /*
       Si no existe ninguna de las funciones anteriores,
       avisamos en lugar de fallar silenciosamente.
    */

    console.warn(
        "No existe una función para cambiar de usuario."
    );

}


/* ============================================================
   CERRAR SELECTOR DE USUARIOS
============================================================ */

function cerrarSelectorUsuarios() {

    const selector =
        document.getElementById(
            "selectorUsuarios"
        );


    if (selector) {

        selector.remove();

    }

}


/* ============================================================
   MOSTRAR INFORMACIÓN
============================================================ */

function mostrarInformacion() {

    cerrarTodosLosModales();


    const anterior =
        document.getElementById(
            "modalInformacion"
        );


    if (anterior) {

        anterior.remove();

    }


    const fondo =
        document.createElement("div");

    fondo.id =
        "modalInformacion";

    fondo.className =
        "fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4";


    const contenido =
        document.createElement("div");

    contenido.className =
        "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden";


    contenido.innerHTML = `

        <div class="bg-[#0A2342]
                    text-white
                    px-6
                    py-5">

            <h2 class="text-2xl
                       font-bold
                       text-center">

                ℹ️ Información

            </h2>

        </div>


        <div class="px-6 py-6 text-center">

            <div class="text-4xl mb-4">

                👮‍♂️

            </div>


            <h3 class="text-xl
                       font-bold
                       text-[#0A2342]
                       mb-2">

                Cuadrante Policía Local Vejer

            </h3>


            <p class="text-gray-600">

                Visor privado del cuadrante
                de servicio.

            </p>


            <p class="text-sm
                      text-gray-500
                      mt-4">

                Versión privada 2.0

            </p>


            <p class="text-sm
                      text-gray-500
                      mt-2">

                Creado por David Lechuga

            </p>

        </div>

    `;


    const zonaBoton =
        document.createElement(
            "div"
        );

    zonaBoton.className =
        "px-6 pb-6";


    zonaBoton.appendChild(

        crearBotonAjustes(
            "↩️",
            "Volver",
            () => {

                cerrarModalInformacion();

            }
        )

    );


    contenido.appendChild(
        zonaBoton
    );

    fondo.appendChild(
        contenido
    );


    fondo.addEventListener(
        "click",
        event => {

            if (
                event.target === fondo
            ) {

                cerrarModalInformacion();

            }

        }
    );


    document.body.appendChild(
        fondo
    );

}


/* ============================================================
   CERRAR INFORMACIÓN
============================================================ */

function cerrarModalInformacion() {

    const modal =
        document.getElementById(
            "modalInformacion"
        );


    if (modal) {

        modal.remove();

    }

}


/* ============================================================
   FIN DE settings.js
============================================================ */