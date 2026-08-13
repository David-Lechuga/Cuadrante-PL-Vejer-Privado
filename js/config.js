/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   EDICIÓN PRIVADA
   CONFIGURACIÓN GENERAL
   Versión 2.0
   Creado por David Lechuga
============================================================ */


/* ============================================================
   INFORMACIÓN DE LA APLICACIÓN
============================================================ */

const APP_CONFIG = {

    nombre:
        "Visor de Cuadrante de la Policía Local de Vejer de la Frontera",

    titulo:
        "CUADRANTE POLICÍA LOCAL VEJER 2026",

    version:
        "2.0",

    creador:
        "David Lechuga"

};


/* ============================================================
   RUTAS DE DATOS
============================================================ */

/*
   Los archivos JSON se encuentran en el directorio raíz
   del proyecto, no dentro de data/.
*/

const RUTAS_DATOS = {

    cuadrantes:
        "cuadrantes.json",

    telefonos:
        "telefonos.json",

    usuarios:
        "usuarios.json"

};


/* ============================================================
   ALMACENAMIENTO LOCAL
============================================================ */

const STORAGE_KEYS = {

    usuario:
        "cuadrante_usuario",

    autenticado:
        "cuadrante_autenticado"

};


/* ============================================================
   TIPOS DE USUARIO
============================================================ */

const TIPOS_USUARIO = {

    AGENTE:
        "agente",

    ADMIN:
        "admin"

};


/* ============================================================
   TURNOS OPERATIVOS
============================================================ */

const TURNOS = {

    MANANA:
        "M",

    NOCHE:
        "N",

    PLAYA:
        "PL"

};


/* ============================================================
   ESTADOS NO OPERATIVOS
============================================================ */

const ESTADOS_NO_OPERATIVOS = {

    DESCANSO:
        "D",

    LIBRE_DISPOSICION:
        "LD",

    HORAS_SINDICALES:
        "HS",

    HORAS_PARTICULARES:
        "HP",

    HUELGA_JORNADA:
        "HJ",

    BAJA:
        "BA",

    ASUNTOS_FAMILIARES:
        "AF",

    VACACIONES:
        "VA"

};


/* ============================================================
   HORAS EXTRAORDINARIAS
============================================================ */

const HORAS_EXTRAS = {

    MANANA_12:
        "HM",

    NOCHE_12:
        "HN",

    MANANA_8:
        "Hm",

    TARDE_8:
        "Ht",

    NOCHE_8:
        "Hn",

    PLAYA:
        "HPL"

};


/* ============================================================
   MESES
============================================================ */

var MESES = [

    "",

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
   TEXTOS DE LA APLICACIÓN
============================================================ */

const TEXTOS = {

    login:

        "Acceso privado",

    password:

        "Contraseña",

    acceder:

        "Acceder",

    contraseñaIncorrecta:

        "Contraseña incorrecta.",

    cambiarAgente:

        "Cambiar de agente",

    informacion:

        "Información",

    cerrar:

        "Cerrar",

    atras:

        "Atrás",

    llamar:

        "Llamar",

    whatsapp:

        "WhatsApp",

    hoy:

        "HOY",

    buscar:

        "BUSCAR",

    administrador:

        "Administrador",

    sinAgentes:

        "Sin agentes",

    ultimaSincronizacion:

        "Última sincronización:"

};


/* ============================================================
   CONFIGURACIÓN DE SERVICIOS
============================================================ */

/*
   Relación entre los turnos ordinarios y sus horas extras.

   Esto nos permitirá utilizar la misma lógica tanto para
   agentes como para el administrador.
*/

const CORRESPONDENCIAS_EXTRAS = {

    M: [

        HORAS_EXTRAS.MANANA_12,

        HORAS_EXTRAS.MANANA_8,

        HORAS_EXTRAS.TARDE_8

    ],

    N: [

        HORAS_EXTRAS.NOCHE_12,

        HORAS_EXTRAS.NOCHE_8

    ],

    PL: [

        HORAS_EXTRAS.PLAYA

    ]

};


/* ============================================================
   CONFIGURACIÓN DE LA VISTA
============================================================ */

const VISTA_CONFIG = {

    mostrarCompanerosAgente:
        true,

    mostrarTodosAdministrador:
        true,

    permitirCambiarAgenteAdministrador:
        true,

    permitirCambiarAgenteAgente:
        true

};


/* ============================================================
   FIN DE CONFIGURACIÓN
============================================================ */