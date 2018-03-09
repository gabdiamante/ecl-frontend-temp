import angular from 'angular';
import GLOBAL from 'Helpers/global';
import UTILS from 'Helpers/util';
import DUMMY from 'Helpers/dummy';
import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier';
import UTIL from '../../helpers/util';

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
        '$timeout',
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
        $timeout,
        QueryService,
        ViewService,
        SocketService,
        logger,
        NgMap
    ) {
        var vm = this;
        var socket = SocketService;
        var bounds = new google.maps.LatLngBounds();

        vm.center_map_lat_lng = $stateParams.center_map_lat_lng || UTILS.latlngcenter;
        vm.isOpen = false;
        vm.visible = false;
        vm.viewOne = false;
        vm.ignoreLoadingBar = false;
        vm.path = [[0, 0]];
        vm.actualRoute = [[0, 0]];
        vm.curState = $state.current.name;
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

        vm.assignPosition = '';
        vm.courierPosition = '';

        vm.map_render = false;
        $timeout(function () {
            vm.map_render = true;
        }, 1000);

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

                socket.emit('echo', { test: 'grabe ka sa akin sir' },
                    function(data) {
                        // logger.success('socket_data',data);
                    }
                );
     
                socket.on('echo', function(data) {
                    logger.success('socket_data',data);
                });


                getAssignments();
                localStorage.setItem('courierId', $stateParams.courier);
            } else {
                getMap();
                getVehicles(vm.hub);
            }
        }

        function getMap() {
            $timeout(function(){
                NgMap.getMap({ id: 'mntrng-map' }).then(function(map) {
                    vm.map = map;
                });

            });
        }

        function spiderFierMarkers(data, activate) {

            NgMap.getMap({ id: 'mntrng-map' }).then(function(map) {
                vm.map = map;
                const options = { 
                    markersWontMove: true,
                    markersWontHide: true,
                    basicFormatEvents: true,
                    keepSpiderfied: true,
                    nearbyDistance: 30,
                    legWeight: 2
                
                }; // Just an example of options - please set your own if necessary 
                const oms = new OverlappingMarkerSpiderfier(map, options);
                vm.oms = oms;
                const iw = new google.maps.InfoWindow();

                oms.addListener('click', function(marker, event) {
                    console.log('s');
                    vm.currentmarker = marker;
                    vm.assign = marker.data;
                    if (vm.assign.lat && vm.assign.lng)
                        vm.assignPosition = vm.assign.lat + ', ' + vm.assign.lng;
                    vm.map.showInfoWindow('assignInfo',vm.assign.lat,vm.assign.lng);
                });

                oms.addListener('spiderfy', function(markers) {
                    console.log('spiderfy');
                    iw.close();
                   // oms.unspiderfy();
                });

                for (let i = 0; i < data.length; i ++) {
                    if (data[i].lat) {
                        var markerLat = angular.copy(data[i].lat);
                        var markerLng = angular.copy(data[i].lng);
                        var latLng = new google.maps.LatLng(
                            markerLat,
                            markerLng
                        );
                        bounds.extend(latLng);
                        const marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            icon: UTILS.icon(data[i].color),
                            data: data[i],
                            id: 'marker-' + (i + 1),
                            label: {
                                text: (i + 1).toString(),
                                color: '#fff',
                                fontSize: '10px'
                            },
                        });
                    
                        console.log(activate);
                         // <-- here 
                        oms.addMarker(marker); 
                    }
                }
                map.fitBounds(bounds);
            });   


            // NgMap.getMap({ id: 'mntrng-map' }).then(function(map) {

            //     vm.map = map;

            //     var oms = new OverlappingMarkerSpiderfier(map, {
            //         markersWontMove: true,
            //         markersWontHide: true,
            //         basicFormatEvents: true,
            //         keepSpiderfied: false,
            //         nearbyDistance: 30,
            //         legWeight: 2
            //     });

            //     console.log('oms',oms);

            //     for (var i = 0; i < data.length; i++) {
            //         if (data[i].lat) {
            //             var markerLat = angular.copy(data[i].lat);
            //             var markerLng = angular.copy(data[i].lng);
            //             var latLng = new google.maps.LatLng(
            //                 markerLat,
            //                 markerLng
            //             );

            //             bounds.extend(latLng);
                                  


            //             var markerOptions = {
            //                 icon: {
            //                     url: UTILS.icon(data[i].color),
            //                     origin: new google.maps.Point(0, 0),
            //                     anchor: new google.maps.Point(15, 15)
            //                 },
            //                 position: latLng,
            //                 data: data[i],
            //                 id: 'marker-' + (i + 1),
            //                 label: {
            //                     text: (i + 1).toString(),
            //                     color: '#fff',
            //                     fontSize: '10px'
            //                 },
            //                 map: map
            //             };

            //             console.log('markerOptions icon', markerOptions.data);
                        
            //             var marker = new google.maps.Marker(markerOptions);
            //             // google.maps.event.addListener(
            //             //     marker,
            //             //     'spider_click',
            //             //     function(e) {
            //             //         console.log('ssss',this.data);
            //             //         vm.assign = this.data;
            //             //         if (vm.assign.lat && vm.assign.lng)
            //             //             vm.assignPosition = vm.assign.lat + ', ' + vm.assign.lng;
            //             //         vm.map.showInfoWindow('assignInfo',vm.assign.lat,vm.assign.lng);
            //             //     }
            //             // );
            //            oms.addMarker(marker);
            //         }
            //     }
            //     map.fitBounds(bounds);
            // });
        }

        function clickAssignment($event, data, index) {
            vm.assign = data;
            vm.zoom = 16;
            var center = new google.maps.LatLng(data.lat, data.lng);
            vm.map.panTo(center);

            if (vm.assign.lat && vm.assign.lng)
                vm.assignPosition = vm.assign.lat + ', ' + vm.assign.lng;
            vm.map.showInfoWindow('assignInfo', center);
        }

        function clickCourier($event, data, index) {
            vm.courier = data;
            if (vm.courier.lat && vm.courier.lng) 
                vm.courierPosition = vm.courier.lat + ', ' + vm.courier.lng;

            console.log('click_courier', vm.map);

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

            // var route = {
            //     express: '',
            //     vehicles: 'out-del'
            // };

            var route = {
                couriers: ''
            };

            var params = {
                all: true,
                hubId: hub.id
            };

            var req = {
                method: 'GET',
                body: false,
                params: params,
                hasFile: false,
                cache: false,
                route: route
            };

            QueryService.query(req).then(
                function(response) {
                    // vm.vehicles = response.data.data.items;
                    vm.vehicles = DUMMY.monitoring.courier_vehicle_out_for_del_list;
                    centerAllCouriers(vm.vehicles);
                    GLOBAL.sortOn(vm.vehicles, 'last_name');
                },
                function(error) {
                    logger.errorFormatResponse(error);
                    vm.isLoading = false;
                }
            );
        }

        function viewDetails(data) {
            console.log(data);
            $state.go(vm.curState, { courier: data.courier_id });
        }

        function viewAll() {
            $state.go(vm.curState, { courier: '' });
        }

        function setIconColor(markers) {

            for (var i = 0; i < markers.length; i++) {
                if (markers[i].date_completed) {
                    markers[i].color = 'green';
                } else if (markers[i].date_attempted) {
                    markers[i].color = 'red';
                } else if (!markers[i].date_attempted) {
                    markers[i].color = 'blue-grey';
                } else {
                    markers[i].color = 'yellow';
                }
            }
            vm.assignments = angular.copy(markers);
            spiderFierMarkers(markers);
        }

        function getAssignments(isLoading, socketUpdate) {
            console.log(isLoading);
            
            // var route = {
            //     express: 'assignments',
            //     courier: $stateParams.courier
            // };

            var route = {
                couriers: ''
            };

            var req = {
                method: 'GET',
                body: false,
                params: false,
                hasFile: false,
                cache: false,
                route: route,
                ignoreLoadingBar: isLoading,
                cache_string: ['assignments']
            };

            QueryService.query(req).then(
                function(response) {
                    response = { data: { data: {} } };
                    response.data.data = DUMMY.monitoring.courier_assignments;
                    console.log('getAssignments', response);
                    setIconColor(response.data.data.assignments || []);
                    vm.courier = response.data.data.courier;
                    // vm.courier.name = vm.courier.first_name + ' ' + vm.courier.last_name;
                    vm.hub = response.data.data.hub;
                    // listenToCourier(vm.courier);
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
                    logger.errorFormatResponse(error);
                    vm.isLoading = false;
                }
            );
        }

        function getPath(response) {
            vm.actualFullRoute = response.data.data.actual_full_route;
            if (vm.courier.assigned_full_route) {
                decodePolylines(vm.courier.assigned_full_route);
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
                    if (vehicles[i].lat) {
                        vm.onlineCount++;
                        var latLng = new google.maps.LatLng(
                            vehicles[i].lat,
                            vehicles[i].lng
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
                if (data[i].date_completed) {
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
                                res[idx].data.snappedPoints[i].location.latitude,
                                res[idx].data.snappedPoints[i].location.longitude
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
                    vm.courier.lat = data.coordinates.lat;
                    vm.courier.lng = data.coordinates.lng;
                });
            });
        }

        function listenToCourier(courier) {
            socket.emit('listenToCourier',{ courierId: courier.courier_id },
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
