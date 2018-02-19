import angular from 'angular';
import GLOBAL from 'Helpers/global';
import UTILS from 'Helpers/util';
import GMAP from 'Helpers/map/gmap';
var jsts = require('jsts');

(function() {
    'use strict';

    angular.module('app').component('zones', {
        template: require('./zones.html'),
        controller: ZonesCtrl,
        controllerAs: 'vm'
    });

    ZonesCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$cookies',
        '$cacheFactory',
        '$filter',
        '$timeout',
        '$anchorScroll',
        '$location',
        'QueryService',
        'ModalService',
        'logger',
        'NgMap'
    ];

    function ZonesCtrl(
        $scope,
        $state,
        $stateParams,
        $cookies,
        $cacheFactory,
        $filter,
        $timeout,
        $anchorScroll,
        $location,
        QueryService,
        ModalService,
        logger,
        NgMap
    ) {
        var vm = this;
        var httpCache = $cacheFactory.get('$http');

        vm.user = GLOBAL.user($cookies, $state);

        //vm.center_map_lat_lng = GLOBAL.map_default_position[0] + ',' + GLOBAL.map_default_position[1];
        vm.center_map_lat_lng = '14.599512, 120.984222';
        //vm.googleMapsUrl = 'https://maps.google.com/maps/api/js';

        vm.route_name = 'zone';
        vm.current_state = $state.current.name;
        vm.search_key = $stateParams.search_value || '';
        vm.TPLS = 'zonesFormModal';

        vm.title = 'Zone';
        vm.titleHeader = vm.title + ' Areas';

        vm.siteType = $stateParams.siteType;
        vm.siteFront = $stateParams.siteFront;
        vm.hubId = $stateParams.hubId;

        vm.mapStyles = UTILS.mapStyles;
        vm.subTitleHeader = vm.titleHeader.slice(0, -1);
        vm.pending_update = 0;
        vm.intersect_count = 0;

        vm.completedPolygon = [[0, 0]];
        vm.polygons = [];
        vm.latLng = [];
        vm.shapes = [];

        vm.zoom = 11;
        vm.minZoom = false;
        vm.maxZoom = false;

        vm.updating = false;
        vm.showModal = true;
        vm.showButton = false;
        vm.showDrawingManager = false;
        vm.notCompleted = true;
        vm.showSaveChanges = false;
        vm.overlap = false;
        vm.overlapCopy = false;
        vm.zoneNotYetLoaded = true;
        vm.showName = false;

        vm.updated_pol = null;

        vm.onMapOverlayCompleted = onMapOverlayCompleted;
        vm.shapeDetailsUpdate = shapeDetailsUpdate;
        vm.savePolygon = savePolygon;
        vm.updatePolygon = updatePolygon;
        vm.clearPolygon = clearPolygon;
        vm.addZone = addZone;
        vm.deleteZone = deleteZone;
        vm.saveChanges = saveChanges;
        vm.cancel = cancel;
        vm.onMouseUp = onMouseUp;
        vm.search = search;
        vm.clearField = clearField;
        vm.colors = UTILS.colors;

        vm.zoomIn = zoomIn;
        vm.zoomOut = zoomOut;
        vm.resetZoom = resetZoom;
        vm.selectType = selectType;
        vm.selectSiteFront = selectSiteFront;
        vm.selectHub = selectHub;

        init();

        NgMap.getMap({ id: 'geofencing' }).then(function(map) {
            google.maps.event.trigger(map, 'resize');
        });

        function init() {
            google.maps.Polygon.prototype.my_getBounds =
                GMAP.prototype.my_getBounds;
            vm[vm.user.app] = true;

            getTypes();
            getSiteFront();
            getHubs();

            // getZones(vm.search_key, true);
        }

        function getMap() {
            NgMap.getMap({ id: 'geofencing' }).then(function(map) {
                vm.geofenceMap = map;
                google.maps.event.trigger(vm.geofenceMap, 'resize');
            });
        }

        function getTypes() {
            vm.site_types = [
                { code: 'HUB', name: 'HUB' },
                { code: 'DC', name: 'DC' }
            ];
            vm.site_types.unshift({ name: 'ALL' });
            vm.site_type = vm.site_type || vm.site_types[0];

            checkSiteType(vm.siteType, vm.site_types);
        }

        function getSiteFront() {
            vm.site_fronts = [
                { code: 'HUB', name: 'HUB' },
                { code: 'DC', name: 'DC' }
            ];
            vm.site_fronts.unshift({ name: 'ALL' });
            vm.site_front = vm.site_front || vm.site_fronts[0];

            checkSiteFront(vm.siteFront, vm.site_fronts);
        }

        function getHubs() {
            vm.loadingHub = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '999999999',
                    page: '1',
                    type: 'HUB',
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: false,
                cache_string: vm.route_name
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('hubs', response);
                        vm.hubs = response.data.data.items;

                        vm.hubs.unshift({ code: 'All', name: 'All' });
                        vm.hub = vm.hub || vm.hubs[0];

                        checkHubId(vm.hubId, vm.hubs);
                        getZones(vm.search_key, true);
                    },
                    function(error) {
                        logger.error(error.data.message);
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loadingHub = false;
                });
        }

        function getZones(key, update_view_center_latlng) {
            vm.isLoading = true;
            vm.zones = [];
            vm.total = 0;
            vm.page = 0;

            var status;

            if ($stateParams.status == 'active') {
                status = false;
            } else {
                status = true;
            }

            var req = {
                method: 'GET',
                body: false,
                // token   : vm.user.token,
                params: { page: 1, limit: 999999999 },
                hasFile: false,
                cache: false,
                // route   : {[vm.route_name]:'' }
                route: { zone: '' }
            };

            if (key) req.params.search_value = key;

            QueryService.query(req)
                .then(
                    function(response) {
                        console.log('z', response);
                        getMap();

                        vm.zones = response.data.data.items || [];
                        filterStringPolygon(vm.zones);

                        // vm.polygonsCopy = angular.copy(vm.zones);
                        vm.polygonsCopy = angular.copy(vm.zones);
                        vm.total = response.data.data.total;
                        // if (update_view_center_latlng)
                        //     vm.center_map_lat_lng = response.data.data.center.lat + ', ' + response.data.data.center.lng;
                    },
                    function(error) {
                        logger.log(
                            error.data.errors[0].context,
                            error,
                            error.data.errors[0].message
                        );
                    }
                )
                .finally(function() {
                    vm.zoneNotYetLoaded = false;
                    vm.isLoading = false;
                });
        }

        function checkSiteType(siteTypeCode, siteTypes) {
            var siteType = siteTypes.filter(function(sT) {
                return sT.code == siteTypeCode;
            })[0];
            vm.site_type = siteType;
        }

        function checkSiteFront(siteFrontCode, siteFronts) {
            var siteFront = siteFronts.filter(function(sT) {
                return sT.code == siteFrontCode;
            })[0];
            vm.site_front = siteFront;
        }

        function checkHubId(hubId, hubs) {
            var hub = hubs.filter(function(hub) {
                return hub.id == hubId;
            })[0];
            vm.hub = hub;
        }

        function selectType(type) {
            $state.go($state.current.name, {
                siteType: type.code,
                siteFront: '',
                hubId: ''
            });
            getZones();
        }

        function selectSiteFront(type) {
            $state.go($state.current.name, {
                siteType: vm.site_type.code,
                siteFront: type.code,
                hubId: ''
            });
            getZones();
        }

        function selectHub(hub) {
            vm.selectedHub = hub;
            vm.hubId = hub.id;
            $state.go($state.current.name, {
                siteType: vm.site_type.code,
                hubId: vm.hubId
            });
            vm.buttonName = hub.name;
            getZones();
        }

        function overlayClickListener(overlay, method) {
            if (!method) return;

            google.maps.event.addListener(overlay, 'mouseup', function(event) {
                var shape = {
                    type: 'polygon'
                };

                NgMap.getMap({ id: 'geofencing' }).then(function(map) {
                    vm.postNewGeofenceMap = map;
                    shape.overlay = overlay;
                    for (var key in vm.postNewGeofenceMap.shapes) {
                        var wkt = checkPolygon(
                            shape.overlay,
                            vm.postNewGeofenceMap.shapes[key]
                        );

                        console.log('overlayClickListener', shape);
                        if (
                            shape.overlay !== vm.geofenceMap.shapes[key] &&
                            vm.zones[vm.shapeIndex].type ==
                                vm.zones[key].type &&
                            typeof vm.zones[vm.shapeIndex].type !=
                                'undefined' &&
                            typeof vm.zones[key].type != 'undefined' &&
                            vm.zones[vm.shapeIndex].type != null &&
                            vm.zones[key].type != null
                        ) {
                            detectOverlap(wkt[0], wkt[1], function(res) {
                                if (res) {
                                    vm.intersect_count++;
                                    logger.info(
                                        'Zone overlaps with other existing zone. Please remove overlap to continue.'
                                    );
                                }
                            });
                        }
                    }

                    handleOverlap();
                });
            });
        }

        function onMapOverlayCompleted(e, method) {
            overlayClickListener(e.overlay, method);

            for (var key in vm.geofenceMap.shapes) {
                var wkt = checkPolygon(e.overlay, vm.geofenceMap.shapes[key]);

                // console.log('onMapOverlayCompleted wkt', wkt);

                if (
                    e.overlay !== vm.geofenceMap.shapes[key] &&
                    vm.zones[vm.shapeIndex].type == vm.zones[key].type &&
                    typeof vm.zones[vm.shapeIndex].type != 'undefined' &&
                    typeof vm.zones[key].type != 'undefined' &&
                    vm.zones[vm.shapeIndex].type != null &&
                    vm.zones[key].type != null
                ) {
                    detectOverlap(wkt[0], wkt[1], function(res) {
                        if (res) {
                            vm.intersect_count++;
                            logger.info(
                                'Zone overlaps with other existing zone. Please remove overlap to continue.'
                            );
                        }
                    });
                }
            }

            handleOverlap();

            vm.showDrawingManager = false;
            vm.shape = e;
            vm.shapePath = e.overlay;
            var polygon = [];
            var oPaths = e.overlay.getPaths();

            var paths = oPaths.getArray ? oPaths.getArray() : oPaths;
            var p_ = function(latLng) {
                return [latLng.lat(), latLng.lng()];
            };

            var l_ = function(path, e) {
                path = path.getArray ? path.getArray() : path;
                if (e) {
                    return google.maps.geometry.encoding.encodePath(path);
                } else {
                    var r = [];
                    for (var i = 0; i < path.length; ++i) {
                        r.push(p_(path[i]));
                    }
                    return r;
                }
            };

            for (var i = 0; i < paths.length; ++i) {
                polygon.push(l_(paths[i], false));
            }
            vm.completedPolygon = JSON.stringify(polygon[0]);
            return vm.completedPolygon;
        }

        function addZone() {
            vm.showDrawingManager = true;
            vm.showButton = true;
        }

        function checkPolygon(poly1, poly2) {
            var wicket = new Wkt.Wkt();

            wicket.fromObject(poly1);
            var wkt1 = wicket.write();

            wicket.fromObject(poly2);
            var wkt2 = wicket.write();

            return [wkt1, wkt2];
        }

        function handleOverlap() {
            if (vm.intersect_count > 0) {
                vm.overlap = true;
                vm.notCompleted = true;
                vm.intersect_count = 0;
            } else {
                vm.notCompleted = false;
                vm.overlap = false;
            }

            vm.overlapCopy = angular.copy(vm.overlap);
        }

        function detectOverlap(wkt1, wkt2, callback) {
            var wktReader = new jsts.io.WKTReader();
            var geom1 = wktReader.read(wkt1);
            var geom2 = wktReader.read(wkt2);

            if (geom2.intersects(geom1)) {
                callback(true);
                vm.showModal = false;
            } else {
                callback(false);
                vm.showModal = true;
            }
        }

        function savePolygon() {
            var new_polygon = onMapOverlayCompleted(vm.shape);
            var data = {};
            data.polygon = JSON.parse(new_polygon);

            var modal = {
                titleHeader: 'Add ' + vm.title,
                polygon: data.polygon
            };

            var request = {
                method: 'POST',
                body: {},
                params: false,
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache_string: vm.route_name
            };

            if (vm.showModal) {
                formModal(request, modal, vm.TPLS).then(
                    function(response) {
                        if (response) {
                            vm.shapePath.setMap(null);
                            vm.shapePath = null;
                            GLOBAL.removeCache('zones', httpCache);
                            vm.showButton = false;
                            getZones(vm.search_key);
                        }
                    },
                    function(error) {
                        logger.error(
                            error.data.message || catchError(request.route)
                        );
                    }
                );
            }
        }

        // function convertArrayToLatlngObject(polygon) {
        //     var polygon_lat_lng = [];
        //     for (var i=0; i< polygon.length; i++)
        //         polygon_lat_lng.push({lat: polygon[i][0], lng: polygon[i][1]});
        //     return polygon_lat_lng;
        // }

        function onMouseUp(e, shape, index) {
            if (typeof vm.shapeIndex != 'undefined' && shape.editable) {
                console.log(index, 'index');
                var data = angular.copy(vm.updated_shape);
                var shape = {
                    type: 'polygon'
                };

                NgMap.getMap({ id: 'geofencing' }).then(function(map) {
                    vm.geofenceMaps = map;

                    Object.keys(vm.geofenceMaps.shapes).forEach(function(prop) {
                        if (prop == vm.shapeIndex) {
                            shape.overlay = vm.geofenceMaps.shapes[prop];
                            for (var key in vm.geofenceMaps.shapes) {
                                //console.log(vm.zones[key], data); // determine dc hub

                                var wkt = checkPolygon(
                                    shape.overlay,
                                    vm.geofenceMaps.shapes[key]
                                );

                                if (
                                    shape.overlay !==
                                        vm.geofenceMap.shapes[key] &&
                                    vm.zones[index].type ==
                                        vm.zones[key].type &&
                                    typeof vm.zones[index].type !=
                                        'undefined' &&
                                    typeof vm.zones[key].type != 'undefined' &&
                                    vm.zones[index].type != null &&
                                    vm.zones[key].type != null
                                ) {
                                    detectOverlap(wkt[0], wkt[1], function(
                                        res
                                    ) {
                                        if (res) {
                                            vm.intersect_count++;
                                            logger.info(
                                                'Zone overlaps with other existing zone. Please remove overlap to continue.'
                                            );
                                        }
                                    });
                                }
                            }

                            handleOverlap();
                        }
                    });
                });
            }
        }

        function saveChanges(shape_update_only) {
            var data = vm.updated_shape;
            var shape = {
                type: 'polygon'
            };

            NgMap.getMap({ id: 'geofencing' }).then(function(map) {
                map.setOptions({ streetViewControl: false });
                vm.geofenceMap = map;

                Object.keys(vm.geofenceMap.shapes).forEach(function(prop) {
                    if (prop == vm.shapeIndex) {
                        shape.overlay = vm.geofenceMap.shapes[prop];
                        var new_polygon = onMapOverlayCompleted(shape);
                        data.polygon = JSON.parse(new_polygon);

                        if (shape_update_only) shapeUpdate(data);
                        else shapeDetailsUpdate(data);
                    }
                });
            });
        }

        function shapeUpdate(data) {
            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: data.id },
                cache_string: vm.route_name
            };

            QueryService.query(request).then(
                function(response) {
                    GLOBAL.removeCache('zones', httpCache);
                    vm.showName = false;
                    vm.shapePath = null;
                    vm.showButton = false;
                    vm.showSaveChanges = false;
                    vm.pending_update = 0;
                    logger.success('Zone area updated');
                    getZones(vm.search_key);
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }

        function shapeDetailsUpdate(data) {
            var modal = {
                titleHeader: 'Update ' + vm.title,
                polygon: data.polygon
            };

            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: data.id },
                cache_string: vm.route_name
            };

            if (vm.showModal) {
                formModal(request, modal, vm.TPLS).then(
                    function(response) {
                        if (response) {
                            GLOBAL.removeCache('zones', httpCache);
                            vm.showName = false;
                            vm.shapePath = null;
                            vm.showButton = false;
                            vm.showSaveChanges = false;
                            vm.pending_update = 0;
                            getZones(vm.search_key);
                        }
                    },
                    function(error) {
                        logger.error(
                            error.data.message || catchError(request.route)
                        );
                    }
                );
            }
        }

        function cancel() {
            vm.zones = [];
            vm.showName = false;
            vm.shapePath = null;
            vm.overlap = angular.copy(vm.overlapCopy);
            $timeout(function() {
                vm.zones = angular.copy(vm.polygonsCopy);
            }, 100);

            vm.showSaveChanges = false;
            vm.pending_update = 0;
            for (var i = vm.zones.length - 1; i >= 0; i--) {
                vm.zones[i].editable = false;
            }
        }

        function formModal(request, modal, template, size) {
            return ModalService.form_modal(request, modal, template, size);
        }

        // function updatePolygon (e, shape, index) {

        //     if( !vm.shapePath) {

        //         vm.notCompleted = true;
        //         vm.updated_shape = shape;
        //         vm.shapeIndex = index;
        //         vm.showSaveChanges = true;
        //         if (vm.pending_update > 0) {
        //             return;
        //         } else {
        //             // var newHash = shape.zone_code;
        //             // if ($location.hash() !== newHash)
        //             //     $location.hash(shape.zone_code);
        //             // else
        //             //     $anchorScroll();

        //             var container = document.getElementById('zone_container');
        //             console.log(shape);
        //             var scrollTo = document.getElementById(shape.groupId);
        //             container.scrollTop = scrollTo.offsetTop - 22; // adjust 22 pixels

        //             var polygon_coords = new google.maps.Polygon({paths: GMAP.utils.convertArrayToLatlngObject(shape.polygon)});
        //             vm.center_map_lat_lng = polygon_coords.my_getBounds().getCenter();

        //             console.log(vm.center_map_lat_lng);

        //             shape.editable = true;
        //             vm.pending_update++;
        //         }

        //         // makeEditable(index);
        //     }

        // }

        function updatePolygon(e, shape, index) {
            vm.showName = true;

            vm.cancelButton = true;
            if (!vm.shapePath && vm.pending_update <= 0) {
                vm.selectedZone = shape;
                vm.notCompleted = true;
                vm.updated_shape = shape;
                vm.shapeIndex = index;

                if (angular.equals(shape.polygon, [[0, 0]])) {
                    vm.showSaveChanges = false;
                    vm.showButton = true;
                    vm.addZone();
                } else {
                    vm.showSaveChanges = true;
                    vm.showButton = false;
                }

                if (vm.pending_update > 0) {
                    return;
                } else {
                    // var newHash = shape.zone_code;
                    // if ($location.hash() !== newHash)
                    //     $location.hash(shape.zone_code);
                    // else
                    //     $anchorScroll();

                    // var container = document.getElementById('zone_container');
                    // var scrollTo = document.getElementById(shape.groupId);
                    // container.scrollTop = scrollTo.offsetTop - 22; // adjust 22 pixels

                    if (
                        !(
                            angular.equals(shape.polygon, [[0, 0]]) ||
                            shape.polygon == null
                        )
                    ) {
                        var polygon_coords = new google.maps.Polygon({
                            paths: GMAP.utils.convertArrayToLatlngObject(
                                shape.polygon
                            )
                        });
                        var lat_lng = polygon_coords.my_getBounds().getCenter();
                        vm.center_map_lat_lng =
                            lat_lng.lat() + ',' + lat_lng.lng();
                    }

                    shape.editable = true;
                    vm.pending_update++;
                }

                // makeEditable(index);
            }
        }

        function makeEditable(index) {
            for (var i = vm.zones.length - 1; i >= 0; i--) {
                if (i == index) {
                    vm.zones[i].editable = true;
                } else {
                    vm.zones[i].editable = false;
                }
            }
        }

        function clearPolygon(e) {
            vm.shapePath.setMap(null);
            vm.shapePath = null;
            vm.notCompleted = true;
            vm.showButton = false;
            vm.showDrawingManager = false;
            vm.completedPolygon = [];
        }

        function deleteZone(zone, index) {
            vm.showButton = false;

            var request = {
                method: 'DELETE',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: zone.id },
                cache_string: vm.route_name
            };

            var content = {
                header: 'Remove ' + vm.subTitleHeader,
                message:
                    'Are you sure you want to remove ' +
                    vm.subTitleHeader.toLowerCase() +
                    ' ',
                prop: zone.zone_code + ' - ' + zone.zone_name
            };

            confirmation(content).then(function(response) {
                if (response) {
                    QueryService.query(request).then(
                        function(response) {
                            getMap();
                            vm.showButton = false;
                            vm.showSaveChanges = false;
                            vm.zones.splice(index, 1);
                            vm.polygonsCopy.splice(index, 1);
                            vm.pending_update = 0;
                        },
                        function(error) {
                            logger.error(error.data.message);
                        }
                    );
                }
            });
        }

        function search(key) {
            $state.go(vm.current_state, { search_value: key });
        }

        function clearField() {
            vm.search_key = '';
            $state.go(vm.current_state, { search_value: '' });
        }

        function zoomIn() {
            console.log('ssin');
            vm.minZoom = false;
            vm.zoom = vm.zoom + 1;
            if (vm.zoom == 15) {
                vm.maxZoom = true;
            }
        }

        function zoomOut() {
            vm.maxZoom = false;
            vm.zoom = vm.zoom - 1;
            if (vm.zoom == 8) {
                vm.minZoom = true;
            }
        }

        function resetZoom() {
            vm.zoom = 11;
            centerToPolygons(vm.geofenceMap.shapes);
        }

        function confirmation(content) {
            return ModalService.confirm_modal(content);
        }

        function filterStringPolygon(zones) {
            for (let z = 0; z < zones.length; z++) {
                zones[z].polygon = JSON.parse(
                    zones[z].string_polygon || '[[]]'
                );

                // temp cond
                if (z == 0 || z == 2 || z == 3) {
                    zones[z].type = 'DC';
                } else if (z == 1) {
                    zones[z].type = 'HUB';
                }
            }
        }
    }
})();
