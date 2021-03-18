require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/tasks/Locator"
], function (esriConfig, Map, MapView, Graphic, Locator) {

    esriConfig.apiKey = "AAPKa52dd6f6221849118792002d03ffaa35lO63UH_XMLV1zNFwEVJM1-lAo6i7o9nvMnev0GhdVpDpq5xnOgV6y-zCpfT12lOC";

    const map = new Map({
        basemap: "arcgis-topographic"
    });

    const view = new MapView({
        map: map,
        center: [-58.3712, -34.6083], // Longitud, latitud
        zoom: 7,
        container: document.querySelector('#viewDiv')
    });

    document.querySelector('#cargarDatos').onclick = function (){
        cargarDatos();
    }


    function buscarPOI() {
        const nombre = document.querySelector('#name');
        const direccion = document.querySelector('#direction');
        const numero = document.querySelector('#number');
        const coordenadas = document.querySelector('#location');
        const categoria = document.querySelector('#class');

        // console.log(params);

        const datosPoi = {
            'nombre': nombre.value,
            'direccion': direccion.value,
            'numero': numero.value,
            'coordanadas': coordenadas.value,
            'categoria': categoria.value
        }

        console.log(datosPoi);


        const btnEnviar = document.querySelector('#enviarForm');
        btnEnviar.addEventListener('click', function () {
            const params = {
                address: {
                    'address': `${direccion.value}`,
                    'nombre': `${nombre.value}`,
                    'numero': `${numero.value}`,
                    'coordenadas': `${coordenadas.value}`,
                    'categoria': `${categoria.value}`
                }
            }

            console.log(params);

            const locator = new Locator({
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?Address={params}&maxLocations=1&f=pjson'
            });
            console.log(locator);

            locator.addressToLocations(params)
                .then((results) => {
                    showResult(results);
                    console.log(results);
                })
        });
    }
    buscarPOI();

    function showResult(results) {
        if (results && results.length) {
            var marker = {
                type: "simple-marker",
                style: "path",
                path:
                    "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
                size: 24,
                color: [231, 27, 27, 1],
                yoffset: 12
            };
            results.map((result) => {
                view.graphics.add(
                    new Graphic({
                        attributes: result.attributes,  // Data attributes returned
                        geometry: result.location, // Point returned
                        symbol: marker,
                        geometry: result.location,
                        attributes: {
                            title: "Dirección",
                            address: result.address
                        },
                        popupTemplate: {
                            title: "{title}",
                            content:
                            "{address}" + "<br>" +
                            "Descripción:" + "{nombre}" + "<br>" +
                            "Coordenadas:" + result.location.longitude.toFixed(5) + "," + result.location.latitude.toFixed(5)
                        }
                    })
                )
            })

        }
    }

    function cargarDatos() {
        var url = "./datos/datos.json";
        var req = new XMLHttpRequest();

        req.responseType = 'json';
        req.open('GET', url, true);
        req.onload = function () {
            agregarMarks(req.response);
        };
        req.send(null);
    }

    function agregarMarks(json) {

        if (!json) {
            return;
        }

        var marker = {
            type: "simple-marker",
            style: "path",
            path:
                "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
            size: 24,
            color: [231, 27, 27, 1],
            yoffset: 12
        };

        json.forEach(function (feature) {
            var x = feature.longitude;
            var y = feature.latitude;

            if (x && y) {
                var point = {
                    type: "point",
                    longitude: x,
                    latitude: y
                };

                view.graphics.add(
                    new Graphic({
                        attributes: {},  // Data attributes returned
                        geometry: point, // Point returned
                        symbol: marker,
                        geometry: point,
                    })
                )

            }

        });
    }

});