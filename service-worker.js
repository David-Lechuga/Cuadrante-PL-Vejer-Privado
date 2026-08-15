const CACHE_NAME = "pl-vejer-v2";

const STATIC_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./img/icono-192.png",
    "./img/icono-512.png"
];


/* ============================================================
   INSTALACIÓN
============================================================ */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(
                    STATIC_FILES
                );

            })

            .then(() => {

                /*
                 * Activamos inmediatamente
                 * la nueva versión.
                 */

                return self.skipWaiting();

            })

    );

});


/* ============================================================
   ACTIVACIÓN
============================================================ */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (
                            key !== CACHE_NAME
                        ) {

                            return caches.delete(
                                key
                            );

                        }

                    })

                );

            })

            .then(() => {

                /*
                 * Tomamos inmediatamente el control
                 * de las páginas abiertas.
                 */

                return self.clients.claim();

            })

    );

});


/* ============================================================
   PETICIONES
============================================================ */

self.addEventListener("fetch", event => {

    const request =
        event.request;


    /*
     * Solo nos interesa controlar
     * peticiones GET.
     */

    if (
        request.method !== "GET"
    ) {

        return;

    }


    const url =
        new URL(
            request.url
        );


    /*
     * --------------------------------------------------------
     * DATOS DINÁMICOS
     * --------------------------------------------------------
     *
     * Estos archivos NUNCA se sirven desde la caché.
     */

    if (

        url.pathname.endsWith(
            "/cuadrantes.json"
        )

        ||

        url.pathname.endsWith(
            "/telefonos.json"
        )

    ) {

        event.respondWith(

            fetch(
                request,
                {
                    cache: "no-store"
                }
            )

        );

        return;

    }


    /*
     * --------------------------------------------------------
     * ARCHIVOS DE LA APLICACIÓN
     * --------------------------------------------------------
     *
     * HTML, JavaScript y CSS siempre se solicitan
     * primero a la red.
     *
     * Si GitHub está disponible:
     *     usamos la versión nueva.
     *
     * Si no hay conexión:
     *     utilizamos la versión guardada en caché.
     */

    const esArchivoAplicacion =

        url.pathname.endsWith(
            ".html"
        )

        ||

        url.pathname.endsWith(
            ".js"
        )

        ||

        url.pathname.endsWith(
            ".css"
        );


    if (
        esArchivoAplicacion
    ) {

        event.respondWith(

            fetch(
                request,
                {
                    cache: "no-store"
                }
            )

                .then(response => {

                    /*
                     * Guardamos la nueva versión
                     * para poder utilizarla sin conexión.
                     */

                    if (
                        response &&
                        response.ok
                    ) {

                        const copia =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        )
                            .then(cache => {

                                cache.put(
                                    request,
                                    copia
                                );

                            });

                    }

                    return response;

                })

                .catch(() => {

                    /*
                     * Si no hay conexión,
                     * utilizamos la versión almacenada.
                     */

                    return caches.match(
                        request
                    );

                })

        );

        return;

    }


    /*
     * --------------------------------------------------------
     * RESTO DE RECURSOS
     * --------------------------------------------------------
     *
     * Para imágenes, iconos y otros recursos:
     *
     * caché primero → red después.
     */

    event.respondWith(

        caches.match(
            request
        )

            .then(response => {

                return (

                    response ||

                    fetch(
                        request
                    )

                );

            })

    );

});