import angular from 'angular';
import GLOBAL from 'Helpers/global';
import UTILS from 'Helpers/util';

(function() {
    'use strict';

    angular.module('app').component('monitoring', {
        template: require('./monitoring.html'),
        controller: MonitoringCtrl,
        controllerAs: 'vm'
    });

    MonitoringCtrl.$inject = [
        '$rootScope',
        '$state',
        '$scope',
        '$stateParams',
        '$cookies',
        '$filter',
        'QueryService',
        'ViewService',
        'SocketService',
        'logger',
        'NgMap'
    ];

    function MonitoringCtrl(
        $rootScope,
        $state,
        $scope,
        $stateParams,
        $cookies,
        $filter,
        QueryService,
        ViewService,
        SocketService,
        logger,
        NgMap
    ) {
        var vm = this;
        var socket = SocketService;
        var bounds = new google.maps.LatLngBounds();
        vm.isOpen = false;
        vm.visible = false;
        vm.viewOne = false;
        vm.ignoreLoadingBar = false;
        vm.path = [[0, 0]];
        vm.actualRoute = [[0, 0]];
        vm.curState = $state.current.name;
        vm.user = GLOBAL.user($cookies, $state);
        vm.mapStyles = UTILS.mapStyles;
        vm.mapUrl = UTILS.mapUrl;
        vm.today = new Date();
        vm.hubIcon = UTILS.hubIcon;

        vm.zoomIn = zoomIn;
        vm.zoomOut = zoomOut;
        vm.viewAll = viewAll;
        vm.resetZoom = resetZoom;
        vm.selectHub = selectHub;
        vm.viewDetails = viewDetails;
        vm.clickCourier = clickCourier;
        vm.polylineArrow = UTILS.polylineArrow;
        vm.viewAssignments = viewAssignments;
        vm.clickAssignment = clickAssignment;
        vm.viewItemDetails = viewItemDetails;

        init();

        function init() {
            vm.hubs = [{ name: 'All', id: '' }];
            vm.hubs = vm.hubs.concat(
                JSON.parse(localStorage.getItem('hubsList'))
            );
            vm.hub = vm.hubs[0];
            vm.hubId = $stateParams.hub || vm.hubs[0].id;
            checkHubId(vm.hubId, vm.hubs);
            if ($stateParams.courier) {
                vm.viewOne = true;
                socket.connect();
                getAssignments();
                localStorage.setItem('courierId', $stateParams.courier);
            } else {
                getVehicles(vm.hub);
                getMap();
            }
        }

        function getMap() {
            NgMap.getMap({ id: 'mntrng-map' }).then(function(map) {
                vm.map = map;
            });
        }

        function spiderFierMarkers(data) {
            NgMap.getMap({ id: 'mntrng-map' }).then(function(map) {
                vm.map = map;
                var oms = new OverlappingMarkerSpiderfier(map, {
                    markersWontMove: true,
                    markersWontHide: true,
                    basicFormatEvents: true,
                    keepSpiderfied: true,
                    nearbyDistance: 10,
                    legWeight: 5
                });

                for (var i = 0; i < data.length; i++) {
                    if (data[i].lat) {
                        var markerLat = data[i].lat;
                        var markerLng = data[i].lng;
                        var latLng = new google.maps.LatLng(
                            markerLat,
                            markerLng
                        );
                        bounds.extend(latLng);
                        var markerOptions = {
                            icon: {
                                url: 'assets/img/' + data[i].color + '.svg',
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(15, 15)
                            },
                            position: latLng,
                            data: data[i],
                            id: 'marker-' + (i + 1),
                            label: {
                                text: (i + 1).toString(),
                                color: '#fff',
                                fontSize: '10px'
                            }
                        };
                        var marker = new google.maps.Marker(markerOptions);
                        google.maps.event.addListener(
                            marker,
                            'spider_click',
                            function(e) {
                                vm.assign = this.data;
                                vm.map.showInfoWindow(
                                    'assignInfo',
                                    vm.assign.lat,
                                    vm.assign.lng
                                );
                            }
                        );
                        oms.addMarker(marker);
                    }
                }
                map.fitBounds(bounds);
            });
        }

        function clickAssignment($event, data, index) {
            vm.assign = data;
            vm.zoom = 16;
            var center = new google.maps.LatLng(data.lat, data.lng);
            vm.map.panTo(center);
            vm.map.showInfoWindow('assignInfo', center);
        }

        function clickCourier($event, data, index) {
            vm.courier = data;
            vm.map.showInfoWindow('courierInfo');
        }

        function viewAssignments() {
            vm.isOpen = !vm.isOpen;
        }

        function checkHubId(hubId, hubs) {
            var hub = hubs.filter(function(hub) {
                hub = hub || {};
                return hub.id == hubId;
            })[0];
            vm.hub = hub;
        }

        function selectHub(hub) {
            $state.go(vm.curState, { hub: hub.id });
        }

        function getVehicles(hub) {
            vm.list = [];
            vm.vehicles = [];
            vm.isLoading = true;
            var route = {
                express: '',
                vehicles: 'out-del'
            };
            var params = {
                all: true,
                hubId: hub.id
            };

            var req = {
                method: 'GET',
                body: false,
                token: vm.user.token,
                params: params,
                hasFile: false,
                cache: true,
                route: route
            };

            QueryService.query(req).then(
                function(response) {
                    vm.vehicles = response.data.data.items;
                    centerAllCouriers(vm.vehicles);
                    GLOBAL.sortOn(vm.vehicles, 'lastName');
                    vm.isLoading = false;
                },
                function(error) {
                    if (error.data.errors) {
                        logger.error(
                            error.data.errors[0].message,
                            error,
                            error.data.errors[0].context
                        );
                    } else {
                        logger.error(error.statusText, error, '');
                    }
                    vm.isLoading = false;
                }
            );
        }

        function viewDetails(data) {
            console.log(data);
            $state.go(vm.curState, { courier: data.courierId });
        }

        function viewAll() {
            $state.go(vm.curState, { courier: '' });
        }

        function setIconColor(markers) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].dateCompleted) {
                    markers[i].color = 'green';
                } else if (markers[i].dateAttempted) {
                    markers[i].color = 'red';
                } else if (!markers[i].dateAttempted) {
                    markers[i].color = 'blue-grey';
                } else {
                    markers[i].color = 'yellow';
                }
            }
            vm.assignments = markers;
            spiderFierMarkers(markers);
        }

        function getAssignments(isLoading, socketUpdate) {
            console.log(isLoading);
            var route = {
                express: 'assignments',
                courier: $stateParams.courier
            };

            var req = {
                method: 'GET',
                body: false,
                token: vm.user.token,
                params: false,
                hasFile: false,
                cache: false,
                route: route,
                ignoreLoadingBar: isLoading,
                cache_string: ['assignments']
            };
            QueryService.query(req).then(
                function(response) {
                    setIconColor(response.data.data.assignments);
                    vm.courier = response.data.data.courier;
                    vm.courier.name =
                        vm.courier.firstName + ' ' + vm.courier.lastName;
                    vm.hub = response.data.data.hub;
                    listenToCourier(vm.courier);
                    changeBookingStatus();
                    changeAwbStatus();
                    courierUpdateLoc();
                    statusUpdate();
                    countCompleted(vm.assignments);
                    if (!isLoading) {
                        getPath(response);
                    }
                },
                function(error) {
                    logger.error(
                        error.data.errors[0].message,
                        error,
                        error.data.errors[0].context
                    );
                    vm.isLoading = false;
                }
            );
        }

        function getPath(response) {
            vm.actualFullRoute = response.data.data.actualFullRoute;
            if (vm.courier.assignedFullRoute) {
                decodePolylines(vm.courier.assignedFullRoute);
            }
            if (vm.actualFullRoute) {
                vm.runsnap = 0;
                decodePolylines(vm.actualFullRoute, 'actualRoute');
            }
        }

        function centerAllCouriers(vehicles) {
            vm.onlineCount = 0;
            NgMap.getMap({ id: 'mntrng-map' }).then(function(map) {
                for (var i = 0; i < vehicles.length; i++) {
                    if (vehicles[i].latitude) {
                        vm.onlineCount++;
                        var latLng = new google.maps.LatLng(
                            vehicles[i].latitude,
                            vehicles[i].longitude
                        );
                        bounds.extend(latLng);
                    }
                }
                map.fitBounds(bounds);
            });
        }

        function countCompleted(data) {
            vm.completed = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].dateCompleted) {
                    vm.completed++;
                }
            }
        }

        function decodePolylines(polylines, str) {
            var latLng = [];
            var decodedPath = new google.maps.geometry.encoding.decodePath(
                polylines
            );
            for (var i = 0; i < decodedPath.length; i++) {
                latLng.push([decodedPath[i].lat(), decodedPath[i].lng()]);
            }

            if (latLng) {
                vm.decodedPath = latLng;
            } else {
                vm.decodedPath = [];
            }
            getFineData(vm.decodedPath, 250, str);
        }

        function getFineData(roughData, resolution, str) {
            var fineIdx = 0;
            var fineData = [];
            var distanceDiff;
            var latLngA;
            var latLngB;
            var steps;
            var step;
            fineData[0] = [];
            for (var i = 1; i < roughData.length; i++) {
                latLngA = roughData[i - 1];
                latLngB = roughData[i];
                latLngA = new google.maps.LatLng(
                    roughData[i - 1][0],
                    roughData[i - 1][1]
                );
                latLngB = new google.maps.LatLng(
                    roughData[i][0],
                    roughData[i][1]
                );
                distanceDiff = google.maps.geometry.spherical.computeDistanceBetween(
                    latLngA,
                    latLngB
                );
                steps = Math.ceil(distanceDiff / resolution);
                step = 1 / steps;
                var previousInterpolatedLatLng = latLngA;
                for (var j = 0; j < steps; j++) {
                    var interpolated = google.maps.geometry.spherical.interpolate(
                        latLngA,
                        latLngB,
                        step * j
                    );
                    if (
                        fineData[fineIdx].length !== 0 &&
                        fineData[fineIdx].length % 100 === 0
                    ) {
                        fineIdx++;
                        fineData[fineIdx] = [];
                    }
                    fineData[fineIdx].push([
                        interpolated.lat(),
                        interpolated.lng()
                    ]);
                }
            }
            runSnapToRoad(fineData, str);
        }

        function runSnapToRoad(fineData, str) {
            QueryService.runSnapToRoad(fineData).then(
                function(res) {
                    var path = [];
                    for (var idx = 0; idx < res.length; idx++) {
                        if (angular.equals({}, res[idx].data)) {
                            continue;
                        }
                        for (
                            var i = 0;
                            i < res[idx].data.snappedPoints.length;
                            i++
                        ) {
                            var latlng = new google.maps.LatLng(
                                res[idx].data.snappedPoints[
                                    i
                                ].location.latitude,
                                res[idx].data.snappedPoints[
                                    i
                                ].location.longitude
                            );
                            path.push(latlng);
                        }
                    }
                    if (str) {
                        vm.actualRoute = path;
                    } else {
                        vm.path = path;
                    }
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function zoomIn() {
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
            if (vm.vehicles) {
                centerAllCouriers(vm.vehicles);
            }
        }

        function viewItemDetails(item) {
            var state = 'app.' + item.assignmentType;
            $state.go(state, { id: item.id });
        }

        function redrawMap() {
            google.maps.event.trigger(vm.map, 'resize');
        }

        window.addEventListener('resize', redrawMap);

        // Socket

        function statusUpdate() {
            socket.on('courierUpdateConnStatus', function(data) {
                console.log('update status', data);
                vm.courier.status = data.status;
            });
        }

        function stopCourierSocket(id) {
            if (id) {
                socket.emit(
                    'unlistenToCourier',
                    { courierId: vm.courier.id },
                    function(data) {
                        logger.log(data);
                    }
                );
            }
        }

        function courierUpdateLoc() {
            socket.on('courierUpdateLocation', function(data) {
                $scope.$apply(function() {
                    vm.courier.latitude = data.coordinates.latitude;
                    vm.courier.longitude = data.coordinates.longitude;
                });
            });
        }

        function listenToCourier(courier) {
            socket.emit(
                'listenToCourier',
                { courierId: courier.courierId },
                function(data) {
                    // console.log(data);
                }
            );
        }

        function changeAwbStatus() {
            socket.on('changeAwbStatus', function(data) {
                console.log('awb status', data);
                getAssignments(true);
            });
        }

        function changeBookingStatus() {
            socket.on('changeBookingStatus', function(data) {
                console.log('booking status', data);
                getAssignments(true);
            });
        }
    }
})();
