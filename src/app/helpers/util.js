const UTIL = {
    logo: require('Images/nav-logo.png'),
    colors: [
        //
        '#f97000',
        '#1a92a0',
        '#d50000',
        '#2c4caa',
        '#008000',
        '#ffab00',
        '#00cad0',
        '#3314ab',
        '#eb403b',
        '#48e6da',
        '#227FB0',
        '#1f5ea8',
        '#b32E37',
        '#6c2a6a',
        '#5c4399',
        '#274389',
        '#2E64FE',
        '#DF01A5',
        '#0B3B24',
        '#BF00FF',
        '#04B4AE',
        '#2ab0c5',
        '#0B3861',
        '#9500d8',
        '#0404B4',
        '#FF0080',
        '#e98931',
        '#8904B1',
        '#2EFEF7',
        '#086A87',
        '#f24e04',
        '#8A0808',
        '#850000',
        '#c10000',
        '#c4ee26',
        '#35f2e4',
        '#336927',
        '#ff00db',
        '#b46c9f',
        '#fd00f2',
        '#fd6600',
        '	#371760'
    ],
    getNetwork: function(string) {
        if (!string) {
            return '';
        }

        var globe = [
            '0817',
            '0994',
            '0905',
            '0995',
            '0917',
            '0915',
            '0997',
            '0916',
            '0975',
            '0935',
            '0926',
            '0977',
            '0927',
            '0978',
            '0956',
            '0936',
            '0937',
            '0945',
            '0906',
            '0996',
            '0976',
            '0979',
            '0955'
        ];

        var smart = [
            '0813',
            '0900',
            '0907',
            '0908',
            '0909',
            '0910',
            '0911',
            '0912',
            '0913',
            '0914',
            '0918',
            '0919',
            '0920',
            '0921',
            '0928',
            '0929',
            '0930',
            '0938',
            '0939',
            '0940',
            '0946',
            '0947',
            '0948',
            '0949',
            '0950',
            '0989',
            '0998',
            '0999'
        ];

        var sun = [
            '0922',
            '0923',
            '0924',
            '0925',
            '0931',
            '0932',
            '0933',
            '0934',
            '0942',
            '0943',
            '0944'
        ];

        var prefix = string.substring(0, 4);

        if (globe.indexOf(prefix) != -1) {
            return 'GLOBE';
        } else if (smart.indexOf(prefix) != -1) {
            return 'SMART';
        } else if (sun.indexOf(prefix) != -1) {
            return 'SUN CELLULAR';
        } else {
            return '';
        }
    },

    buildQueryString: function(obj) {
        return Object.keys(obj).reduce(function(str, key, index) {
            if (!str) {
                str += '?' + key + '=' + obj[key];
            } else {
                str += '&' + key + '=' + obj[key];
            }
            return str;
        }, '');
    },

    // This function given a wkt polygon string,
    // returns an array of latlngs.
    wktToLatlngs: function(multipolygonWKT) {
        var polylines = [];

        multipolygonWKT = multipolygonWKT.replace('POLYGON', '');

        var formattedValues = multipolygonWKT.replace('))', '');

        formattedValues = formattedValues.replace('((', '');

        var linesCoords = formattedValues.split('), (');

        for (i = 0; i < linesCoords.length; i++) {
            polylines[i] = [];
            var singleLine = linesCoords[i].split(', ');

            for (j = 0; j < singleLine.length; j++) {
                var coordinates = singleLine[j].split(' ');
                var latlng = {
                    lat: parseFloat(coordinates[0]),
                    lng: parseFloat(coordinates[1])
                };
                polylines[i].push(latlng);
            }
        }

        return polylines[0];
    },

    circleToWKT: function(circle) {
        var radius = circle.getRadius();
        var lat = circle.getCenter().lat();
        var lng = circle.getCenter().lng();

        return ['CIRCLE', '(' + lat, lng + ',', radius + ')'].join(' ');
    },

    averageLatlngs: function(latlngs) {
        var latSum = latlngs.reduce(function(total, latlng) {
            return total + latlng.lat;
        }, 0);

        var lngSum = latlngs.reduce(function(total, latlng) {
            return total + latlng.lng;
        }, 0);

        return {
            lat: latSum / latlngs.length,
            lng: lngSum / latlngs.length
        };
    },

    getPolygonBounds: function(polygon) {
        var bounds = new google.maps.LatLngBounds();
        polygon.getPath().forEach(function(element, index) {
            bounds.extend(element);
        });
        return bounds;
    },
    getMarkerBounds: function(markers) {
        var bounds = new google.maps.LatLngBounds();

        markers.forEach(function(marker) {
            bounds.extend(marker.getPosition());
        });

        return bounds;
    },
    polygonToWKT: function(object) {
        var wkt = new Wkt.Wkt();

        wkt.fromObject(object);

        wkt.components.forEach(function(component) {
            component.forEach(function(xy) {
                var z = xy.x;
                xy.x = xy.y;
                xy.y = z;
            });
        });

        return wkt.write();
    },
    polylineToWKT: function(object) {
        var wkt = new Wkt.Wkt();

        wkt.fromObject(object);

        wkt.components.forEach(function(xy) {
            var z = xy.x;
            xy.x = xy.y;
            xy.y = z;
        });

        return wkt.write();
    },
    wktToPolygon: function(wktString) {
        var wkt = new Wkt.Wkt();

        // debugger;

        wkt.read(wktString);

        // Swap the latlngs
        wkt.components.forEach(function(component) {
            component.forEach(function(xy) {
                var z = xy.x;
                xy.x = xy.y;
                xy.y = z;
            });
        });

        return wkt.toObject();
    },
    wktToPolyline: function(wktString) {
        var wkt = new Wkt.Wkt();

        // debugger;

        wkt.read(wktString);

        // Swap the latlngs
        wkt.components.forEach(function(xy) {
            var z = xy.x;
            xy.x = xy.y;
            xy.y = z;
        });

        return wkt.toObject();
    },
    getPolylineEnds: function(polyline) {
        var path = polyline.getPath();

        var start = path.getAt(0);
        var end = path.getAt(path.length - 1);

        return [
            new google.maps.Marker({ position: start }),
            new google.maps.Marker({ position: end })
        ];
    },
    generateRandomColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    apiKey: 'AIzaSyB7qDqpj2GgOSU7YaGk5Vccv8fFKBinkt4',
    snapToRoadUrl: 'https://roads.googleapis.com/v1/snapToRoads',
    mapUrl: '//maps.google.com/maps/api/js?key=AIzaSyAbc_f76Ej5CwmfeGq0p-lYHtJWSyOLk34&libraries=drawing,geometry,places',
    dateFormat: 'YYYY-MM-DD',
    menu: [
        {
            title: 'Dashboard',
            state: 'app.dashboard',
            icon: 'area-chart',
            params: {
                errorsPage: 1,
                errorsSize: 5
            }
        },
        {
            title: 'Deliveries',
            state: 'app.deliveries',
            icon: 'th-large',
            params: {
                page: 1,
                size: 10,
                status: 'PENDING',
                search: ''
            }
        }
    ],
    deliveryChartOptions: {
        backgroundColor: {
            fill: 'transparent'
        },
        legend: 'none',
        is3D: false,
        colors: ['#607d8b', '#4CAF50', '#f44336']
    },
    courierDChartOptions: {
        backgroundColor: {
            fill: 'transparent'
        },
        legend: 'none',
        is3D: false,
        colors: ['#607d8b', '#4CAF50', '#f44336']
    },
    courierPChartOptions: {
        backgroundColor: {
            fill: 'transparent'
        },
        legend: 'none',
        is3D: false,
        colors: ['#607d8b', '#4CAF50', '#f44336']
    },
    bgColors: [
        '#4BC0C0', //green
        '#FF6384', //light-red
        '#00dcc6' //theme-l1
    ],
    bgColors2: ['#67bd6a', '#f6675d', '#00dcc6'],

    vehicleTypes: ['TRUCK', 'MOTORCYCLE'],
    clusterMapOptions: {
        imagePath: 'assets/img/cluster/m',
        maxZoom: 15
    },
    markerImage: 'assets/img/marker.svg',
    colorMarker: 'assets/img/',
    latlngcenter: '14.599512, 120.984222',
    mapStyles: [
        {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#444444'
                }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'all',
            stylers: [
                {
                    saturation: -100
                },
                {
                    lightness: 45
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [
                {
                    hue: '#ff0000'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'simplified'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#e09826'
                }
            ]
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'transit',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'all',
            stylers: [
                {
                    color: '#00ff80'
                },
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#0b65b1'
                }
            ]
        }
    ],
    hubIcon: {
        url: require('Images/map_svg/warehouse.svg'), // url
        scaledSize: [35, 35]
    },
    icon: function(color) {
        return require('Images/map_svg/'+color+'.svg');
    },
    types: ['delivery', 'pickup'],
    moduleItems: {
        users: [
            {
                name: 'couriers',
                icon: 'fa-users',
                import: {
                    express: '',
                    couriers: '',
                    import: ''
                },
                export: {
                    express: '',
                    couriers: '',
                    export: ''
                }
            },
            {
                name: 'csr',
                icon: 'fa-address-card',
                import: {
                    express: '',
                    csr: '',
                    import: ''
                },
                export: {
                    express: '',
                    csr: '',
                    export: ''
                }
            },
            {
                name: 'merchants',
                icon: 'fa-cubes',
                import: {
                    express: '',
                    merchants: '',
                    import: ''
                },
                export: {
                    express: '',
                    merchants: '',
                    export: ''
                }
            },
            {
                name: 'hub_supports',
                icon: 'fa-address-book',
                import: {
                    express: '',
                    hub_supports: '',
                    import: ''
                },
                export: {
                    express: '',
                    hub_supports: '',
                    export: ''
                }
            },
            {
                name: 'dispatchers',
                icon: 'fa-clipboard',
                import: {
                    express: '',
                    dispatchers: '',
                    import: ''
                },
                export: {
                    express: '',
                    dispatchers: '',
                    export: ''
                }
            },
            {
                name: 'personnels',
                icon: 'fa-slideshare',
                import: {
                    express: '',
                    personnels: '',
                    import: ''
                },
                export: {
                    express: '',
                    personnels: '',
                    export: ''
                }
            }
        ],
        data_management: [
            {
                name: 'hubs',
                icon: 'fa-building',
                import: {
                    express: '',
                    hubs: '',
                    import: ''
                },
                export: {
                    express: '',
                    hubs: '',
                    export: ''
                }
            },
            {
                name: 'distribution_centers',
                icon: 'fa-building',
                import: {
                    express: '',
                    hubs: '',
                    import: ''
                },
                export: {
                    express: '',
                    hubs: '',
                    export: ''
                }
            },
            {
                name: 'vehicles',
                icon: 'fa-motorcycle',
                import: {
                    express: '',
                    vehicles: '',
                    import: ''
                },
                export: {
                    express: '',
                    vehicles: '',
                    export: ''
                }
            },
            {
                name: 'bin',
                icon: 'fa-codepen',
                import: {
                    express: '',
                    bin: '',
                    import: ''
                },
                export: {
                    express: '',
                    bin: '',
                    export: ''
                }
            },
            {
                name: 'packaging_codes',
                icon: 'fa-qrcode',
                import: {
                    express: '',
                    'packaging-codes': '',
                    import: ''
                },
                export: {
                    express: '',
                    'packaging-codes': '',
                    export: ''
                }
            }
        ]
    }
};

UTIL.colors = UTIL.colors.concat(getRandomColors(200));

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
    return color;
}

function getRandomColors(repeat) {
    var arr = [];
    for (var i = 0; i <= repeat; i++) {
        arr.push(getRandomColor());
    }
    return arr;
}

export default UTIL;
