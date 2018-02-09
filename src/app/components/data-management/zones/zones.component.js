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
        vm.titleHeader = 'Zone Areas';
        vm.subTitleHeader = vm.titleHeader.slice(0, -1);
        vm.pending_update = 0;
        vm.intersect_count = 0;

        vm.completedPolygon = [[0, 0]];
        vm.polygons = [];
        vm.latLng = [];
        vm.shapes = [];

        vm.updating = false;
        vm.showModal = true;
        vm.showButton = false;
        vm.showDrawingManager = false;
        vm.notCompleted = true;
        vm.showSaveChanges = false;
        vm.overlap = false;
        vm.zoneNotYetLoaded = true;

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

        init();

        NgMap.getMap({ id: 'geofencing' }).then(function(map) {
            google.maps.event.trigger(map, 'resize');
        });

        function init() {
            google.maps.Polygon.prototype.my_getBounds =
                GMAP.prototype.my_getBounds;
            vm[vm.user.app] = true;
            getZones(vm.search_key, true);
        }

        function getMap() {
            NgMap.getMap({ id: 'geofencing' }).then(function(map) {
                vm.geofenceMap = map;
                google.maps.event.trigger(vm.geofenceMap, 'resize');
            });
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
                        if (shape.overlay !== vm.geofenceMap.shapes[key]) {
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
                if (e.overlay !== vm.geofenceMap.shapes[key]) {
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
                header: 'Add ' + vm.subTitleHeader,
                title: vm.subTitleHeader,
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
                                var wkt = checkPolygon(
                                    shape.overlay,
                                    vm.geofenceMaps.shapes[key]
                                );
                                if (
                                    shape.overlay !== vm.geofenceMap.shapes[key]
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
                header: 'Update ' + vm.subTitleHeader,
                title: vm.subTitleHeader,
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
            vm.shapePath = null;
            vm.zones = angular.copy(vm.polygonsCopy);
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
            vm.cancelButton = true;

            if (!vm.shapePath && vm.pending_update <= 0) {
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

                    var container = document.getElementById('zone_container');
                    var scrollTo = document.getElementById(shape.groupId);
                    container.scrollTop = scrollTo.offsetTop - 22; // adjust 22 pixels

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
                params: { limit: 999999999 },
                hasFile: false,
                cache: false,
                // route   : {[vm.route_name]:'' }
                route: { 'data-management': 'store_group' }
            };

            if (key) req.params.search_value = key;

            QueryService.query(req)
                .then(
                    function(response) {
                        console.log('z', response);
                        getMap();
                        vm.zones = response.data.data.items;
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

        function search(key) {
            $state.go(vm.current_state, { search_value: key });
        }

        function clearField() {
            vm.search_key = '';
            $state.go(vm.current_state, { search_value: '' });
        }

        function confirmation(content) {
            return ModalService.confirm_modal(content);
        }
    }
})();
