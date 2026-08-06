/* ============================================================
   VISOR CUADRANTE POLICÍA LOCAL VEJER
   VERSIÓN PRIVADA 2.0
   Creado por David Lechuga
============================================================ */

let cuadrantes = {};
let telefonos = {};
let usuarios = {};

let agenteActual = null;

const STORAGE_KEY = "plv_agente";

const TURNOS_OPERATIVOS = [
    "M",
    "N",
    "PL"
];

const TURNOS_NO_OPERATIVOS = [
    "D",
    "LD",
    "HS",
    "HP",
    "HJ",
    "BA",
    "AF",
    "VA",
    "CM",
    "CN",
    "CV",
    "P"
];

/* ============================================================
   INICIO
============================================================ */

document.addEventListener("DOMContentLoaded", iniciarAplicacion);

/* ============================================================
   APLICACIÓN
============================================================ */

async function iniciarAplicacion() {

    await cargarDatos();

    comprobarSesion();

    rellenarDias();

    actualizarMesActual();

    document.getElementById("hoy").addEventListener("click", irAHoy);

    const botonBuscar = document.getElementById("buscar");

    if (botonBuscar) {
        botonBuscar.addEventListener("click", buscarTurnos);
    }

}

/* ============================================================
   CARGA DE DATOS
============================================================ */

async function cargarDatos() {

    try {

        const t = Date.now();

        const respuestaCuadrante =
            await fetch(`data/cuadrantes.json?t=${t}`, {
                cache: "no-store"
            });

        const respuestaTelefonos =
            await fetch(`data/telefonos.json?t=${t}`, {
                cache: "no-store"
            });

        const respuestaUsuarios =
            await fetch(`data/usuarios.json?t=${t}`, {
                cache: "no-store"
            });

        const datosCuadrante = await respuestaCuadrante.json();

        cuadrantes = datosCuadrante;

        telefonos = await respuestaTelefonos.json();

        usuarios = await respuestaUsuarios.json();

        if (datosCuadrante.actualizado) {

            const ultima =
                document.getElementById("ultimaActualizacion");

            if (ultima) {

                ultima.innerHTML =
                    "Última sincronización: " +
                    datosCuadrante.actualizado;

            }

        }

    } catch (error) {

        console.error(error);

        alert("Error cargando los datos.");

    }

}

/* ============================================================
   AUTENTICACIÓN
============================================================ */

function comprobarSesion() {

    const agenteGuardado =
        localStorage.getItem(STORAGE_KEY);

    if (!agenteGuardado) return;

    agenteActual = agenteGuardado;

    mostrarAplicacion();

}

/* ============================================================
   LOGIN
============================================================ */

function iniciarSesion(password) {

    password = password.trim();

    const usuario = usuarios.find(u => u.password === password);

    if (!usuario) {

        alert("Contraseña incorrecta");

        return false;

    }

    agenteActual = usuario.agente;

    localStorage.setItem(STORAGE_KEY, agenteActual);

    mostrarAplicacion();

    return true;

}

/* ============================================================
   CERRAR SESIÓN
============================================================ */

function cerrarSesion() {

    localStorage.removeItem(STORAGE_KEY);

    agenteActual = null;

    location.reload();

}

/* ============================================================
   MOSTRAR APLICACIÓN
============================================================ */

function mostrarAplicacion() {

    const login =
        document.getElementById("loginScreen");

    const app =
        document.getElementById("appContent");

    if (login) {

        login.classList.add("hidden");

    }

    if (app) {

        app.classList.remove("hidden");

    }

}
/* ============================================================
   OBTENER NOMBRE DEL MES
============================================================ */

function obtenerNombreMes(numero) {

    const meses = [
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

    return meses[numero];

}

/* ============================================================
   OBTENER DATOS DEL AGENTE
============================================================ */

function obtenerServicioAgente(dia, mes) {

    const datosMes = cuadrantes[mes];

    if (!datosMes) return null;

    return datosMes.find(item =>
        Number(item.dia) === Number(dia) &&
        item.agente === agenteActual
    );

}

/* ============================================================
   COMPAÑEROS DEL MISMO TURNO
============================================================ */

function obtenerCompaneros(dia, mes, turno) {

    const datosMes = cuadrantes[mes];

    if (!datosMes) return [];

    return datosMes
        .filter(item =>
            Number(item.dia) === Number(dia) &&
            item.turno === turno &&
            item.agente !== agenteActual
        )
        .map(item => item.agente);

}

/* ============================================================
   HORAS EXTRAS RELACIONADAS
============================================================ */

function obtenerHorasExtras(dia, mes, turnoPrincipal) {

    const datosMes = cuadrantes[mes];

    if (!datosMes) return [];

    let codigos = [];

    switch (turnoPrincipal) {

        case "M":
            codigos = ["HM", "Hm", "Ht"];
            break;

        case "N":
            codigos = ["HN", "Hn"];
            break;

        case "PL":
            codigos = ["HPL"];
            break;

        default:
            return [];

    }

    return datosMes.filter(item =>
        Number(item.dia) === Number(dia) &&
        codigos.includes(item.turno)
    );

}

/* ============================================================
   ¿ES TURNO OPERATIVO?
============================================================ */

function esTurnoOperativo(turno) {

    return TURNOS_OPERATIVOS.includes(turno);

}

/* ============================================================
   ¿ES TURNO NO OPERATIVO?
============================================================ */

function esTurnoNoOperativo(turno) {

    return TURNOS_NO_OPERATIVOS.includes(turno);

}

/* ============================================================
   FORMATO DEL TÍTULO DEL TURNO
============================================================ */

function tituloTurno(turno) {

    switch (turno) {

        case "M":
            return "🌞 MAÑANA";

        case "N":
            return "🌙 NOCHE";

        case "PL":
            return "🏖️ PLAYA";

        case "VA":
            return "🏝️ VACACIONES";

        case "D":
            return "DESCANSO";

        case "BA":
            return "BAJA";

        case "AF":
            return "ASUNTOS FAMILIARES";

        case "LD":
            return "LIBRANZA";

        case "HS":
            return "HORAS SINDICALES";

        case "HP":
            return "HORAS PARTICULARES";

        case "HJ":
            return "HORAS JUDICIALES";

        default:
            return turno;

    }

}
/* ============================================================
   BÚSQUEDA PRIVADA
============================================================ */

function buscarTurnos() {

    if (!agenteActual) {
        alert("No hay ningún agente identificado.");
        return;
    }

    const dia = Number(document.getElementById("dia").value);
    const mesNumero = Number(document.getElementById("mes").value);

    const nombreMes = obtenerNombreMes(mesNumero);

    const servicio = obtenerServicioAgente(dia, nombreMes);

    if (!servicio) {

        document.getElementById("resultado").innerHTML = `
            <div class="bg-red-100 text-red-700 rounded-xl p-6 text-center">
                No existe servicio para el día seleccionado.
            </div>
        `;

        return;
    }

    const turno = servicio.turno.trim();

    /* ==========================================
       TURNOS NO OPERATIVOS
    ========================================== */

    if (esTurnoNoOperativo(turno)) {

        document.getElementById("resultado").innerHTML = `

        <h2 class="text-3xl font-bold mb-6 text-[#0A2342]">
            ${dia} de ${nombreMes}
        </h2>

        ${crearCaja(
            tituloTurno(turno),
            [agenteActual],
            turno
        )}

        `;

        activarEventosAgentes();

        return;

    }

    /* ==========================================
       TURNOS OPERATIVOS
    ========================================== */

    const companeros =
        obtenerCompaneros(
            dia,
            nombreMes,
            turno
        );

    const horasExtras =
        obtenerHorasExtras(
            dia,
            nombreMes,
            turno
        );

    const listaTurno = [
        agenteActual,
        ...companeros
    ];

    let htmlExtras = "";

    if (horasExtras.length > 0) {

        horasExtras.forEach(extra => {

            let titulo = "";

            switch (extra.turno) {

                case "HM":
                    titulo = "Mañana 12h";
                    break;

                case "HN":
                    titulo = "Noche 12h";
                    break;

                case "Hm":
                    titulo = "Mañana 8h";
                    break;

                case "Ht":
                    titulo = "Tarde 8h";
                    break;

                case "Hn":
                    titulo = "Noche 8h";
                    break;

                case "HPL":
                    titulo = "Playa";
                    break;

            }

            htmlExtras += crearCaja(
                titulo,
                [extra.agente],
                extra.turno
            );

        });

    }

    document.getElementById("resultado").innerHTML = `

    <h2 class="text-3xl font-bold mb-6 text-[#0A2342]">
        ${dia} de ${nombreMes}
    </h2>

    ${crearCaja(
        tituloTurno(turno),
        listaTurno,
        turno
    )}

    <div class="mt-6">

        <div class="tarjeta">

            <h3 class="text-2xl font-bold text-center mb-6 text-[#0A2342]">

                SERVICIOS EXTRAORDINARIOS

            </h3>

            ${
                horasExtras.length
                ?

                `<div class="grid md:grid-cols-3 gap-4">
                    ${htmlExtras}
                </div>`

                :

                `<div class="text-center text-gray-500 italic py-6">

                    Sin agentes

                </div>`

            }

        </div>

    </div>

    `;

    activarEventosAgentes();

}
/* ============================================================
   CREAR TARJETA
============================================================ */

function crearCaja(titulo, lista, turno) {

    let contenido = "";

    if (!lista || lista.length === 0) {

        contenido = `
            <div class="text-center text-gray-500 italic py-4">
                Sin agentes
            </div>
        `;

    } else {

        contenido = lista.map(nombre => {

            const nombreSeguro = String(nombre)
                .replace(/"/g, "&quot;");

            return `
                <div
                    class="agent-item flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow hover:bg-blue-50 cursor-pointer transition"
                    data-nombre="${nombreSeguro}"
                    data-turno="${turno}"
                    data-fecha="${document.getElementById("dia").value}/${document.getElementById("mes").value}"
                >

                    <span class="font-medium">

                        ${nombreSeguro}

                    </span>

                    <span class="text-blue-700 font-bold">

                        >

                    </span>

                </div>

            `;

        }).join("");

    }

    return `

    <div class="tarjeta">

        <h3 class="text-2xl font-bold text-center text-[#0A2342] mb-6">

            ${titulo}

        </h3>

        <div class="space-y-3">

            ${contenido}

        </div>

    </div>

    `;

}

/* ============================================================
   ACTUALIZAR MES ACTUAL
============================================================ */

function actualizarMesActual() {

    const hoy = new Date();

    const selectorMes =
        document.getElementById("mes");

    if (selectorMes) {

        selectorMes.value = hoy.getMonth() + 1;

    }

}

/* ============================================================
   RELLENAR DÍAS
============================================================ */

function rellenarDias() {

    const selector =
        document.getElementById("dia");

    if (!selector) return;

    selector.innerHTML = "";

    for (let i = 1; i <= 31; i++) {

        const opcion =
            document.createElement("option");

        opcion.value = i;

        opcion.textContent = i;

        selector.appendChild(opcion);

    }

    selector.value = new Date().getDate();

}

/* ============================================================
   BOTÓN HOY
============================================================ */

function irAHoy() {

    const hoy = new Date();

    document.getElementById("dia").value =
        hoy.getDate();

    document.getElementById("mes").value =
        hoy.getMonth() + 1;

    buscarTurnos();

}
/* ============================================================
   EVENTOS DE LOS AGENTES
============================================================ */

function activarEventosAgentes() {

    const elementos = document.querySelectorAll(".agent-item");

    elementos.forEach(elemento => {

        elemento.addEventListener("click", () => {

            const nombre = elemento.dataset.nombre;
            const turno = elemento.dataset.turno;
            const fecha = elemento.dataset.fecha;

            abrirMenuAgente(nombre, turno, fecha);

        });

    });

}

/* ============================================================
   OBTENER TELÉFONO
============================================================ */

function obtenerTelefono(nombre) {

    if (!telefonos) return "";

    if (Array.isArray(telefonos)) {

        const encontrado = telefonos.find(t => t.nombre === nombre);

        return encontrado ? encontrado.telefono : "";

    }

    return telefonos[nombre] || "";

}

/* ============================================================
   MODAL AGENTE
============================================================ */

function abrirMenuAgente(nombre, turno, fecha) {

    const telefono = obtenerTelefono(nombre);

    const modal = document.getElementById("modalAgente");

    if (!modal) return;

    modal.classList.remove("hidden");
    modal.classList.add("is-open");

    document.getElementById("modalNombre").textContent = nombre;

    const botonWhatsapp =
        document.getElementById("btnWhatsapp");

    const botonLlamar =
        document.getElementById("btnLlamar");

    const mensaje =
`Hola ${nombre}, te escribo desde la app porque el día ${fecha} estamos juntos en el turno ${turno}.`;

    botonWhatsapp.onclick = () => {

        if (!telefono) return;

        window.open(
            `https://wa.me/34${telefono}?text=${encodeURIComponent(mensaje)}`,
            "_blank"
        );

    };

    botonLlamar.onclick = () => {

        if (!telefono) return;

        window.location.href = "tel:" + telefono;

    };

}

/* ============================================================
   CERRAR MODAL
============================================================ */

function cerrarModalAgente() {

    const modal = document.getElementById("modalAgente");

    if (!modal) return;

    modal.classList.remove("is-open");

    setTimeout(() => {

        modal.classList.add("hidden");

    }, 200);

}

/* ============================================================
   CAMBIAR DE AGENTE
============================================================ */

function cambiarAgente() {

    cerrarSesion();

}

/* ============================================================
   INFORMACIÓN
============================================================ */

function mostrarInformacion() {

    alert(

`Visor de Cuadrante Policía Local de Vejer de la Frontera 2026

Creado por David Lechuga

Versión privada 2.0`

    );

}

/* ============================================================
   AJUSTES
============================================================ */

function abrirAjustes() {

    const opcion = prompt(

`AJUSTES

1 - Cambiar de agente

2 - Información

3 - Cancelar`

    );

    switch (opcion) {

        case "1":
            cambiarAgente();
            break;

        case "2":
            mostrarInformacion();
            break;

    }

}

/* ============================================================
   CIERRE
============================================================ */

console.log("Visor Cuadrante Policía Local Vejer 2026 - Versión Privada 2.0");