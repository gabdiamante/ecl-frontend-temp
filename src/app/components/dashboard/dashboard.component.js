import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import UTILS from 'Helpers/util';
import { GoogleCharts } from 'google-charts';

(function() {
    'use strict';

    angular.module('app').component('dashboard', {
        template: require('./dashboard.html'),
        controller: DashboardCtrl,
        controllerAs: 'vm'
    });

    DashboardCtrl.$inject = [
        '$scope',
        '$state',
        '$cookies',
        'ModalService',
        'QueryService',
        'SocketService',
        'logger',
        'NgMap'
    ];

    function DashboardCtrl(
        $scope, 
        $state, 
        $cookies, 
        ModalService, 
        QueryService, 
        SocketService, 
        logger, 
        NgMap
    ) {
        var vm              = this;
        vm.titleHeader      = 'Dashboard';
        var socket          = SocketService;
        var bounds          = new google.maps.LatLngBounds();
        vm.user             = $cookies.getObject('user');
        vm.hub              = {};
        vm.dynMarkers       = [];
        vm.bgColors         = UTILS.bgColors;
        vm.bgColors2        = UTILS.bgColors2;
        // vm.mapStyles        = UTILS.mapStyles;
        vm.mapOptions       = UTILS.clusterMapOptions;

        vm.goToPickups      = goToPickups;
        vm.showDropdown     = showDropdown;
        vm.goToDeliveries   = goToDeliveries;
        vm.getPerformance   = getPerformance;
        vm.round            = window.Math.round; 

        vm.delivery_data    = [
            ['Delivery', 'Percentage'],
            ['No Attempt', 60],
            ['Unsuccessful', 22],
            ['Successful', 18]
        ];
        vm.pickup_data      = [
            ['Pickup', 'Percentage'],
            ['No Attempt', 48],
            ['Unsuccessful', 22],
            ['Successful', 30]
        ];

        if(vm.user){
            init();
        }

        function init() {
            // socket.connect();
            getData();
            // getVehicles();
            // getPerformance();
            // dashboardUpdate();
            getMap();
        }

        function getMap (data) {
           vm.dynMarkers = []; 
            NgMap.getMap({ id:'dashboard-map' }).then(function(map) { 
                vm.dashboardMap = map;               
                // vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, vm.mapOptions);
                // createSpiderFier(data,vm.dashboardMap);
            });
        }


        function createSpiderFier (data, map) {
            vm.markerCount = 0;
            var oms = new OverlappingMarkerSpiderfier(map, { 
                markersWontMove: true, 
                markersWontHide: true, 
                basicFormatEvents: true, 
                nearbyDistance: 100, 
                legWeight: 2 
            });
            var mti = google.maps.MapTypeId;
            oms.legColors.usual[mti.ROADMAP] = '#607d8b';


            for (var i=0; i<data.length; i++) { 
                    if(data[i].latitude){ 
                        vm.markerCount++;
                        var markerLat = data[i].latitude;
                        var markerLng = data[i].longitude;
                        var latLng = new google.maps.LatLng(markerLat, markerLng); 
                        bounds.extend(latLng);
                        var markerOptions = {
                            position:latLng,
                            icon: {
                                url:UTILS.markerImage
                            },
                            data:data[i]
                        };
                        var marker = new google.maps.Marker(markerOptions);
                        
                        vm.dynMarkers.push(marker); 
                        google.maps.event.addListener(marker, 'spider_click', function(e) {
                            vm.courier = this.data;
                            vm.zoom=14;
                            vm.center = new google.maps.LatLng(this.data.latitude, this.data.longitude);
                            vm.dashboardMap.showInfoWindow('courier-info-window', this);
                        });
                        oms.addMarker(marker);
                    }
                }
                map.fitBounds(bounds);             
                vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, vm.mapOptions);
        }

        
        function showDropdown () {
            vm.visible = vm.visible ? false : true;
        }
    
        function getData (hub, params) {
            var parameters = {};
            vm.isLoading = true;

            var r = {
                express:"",
                assignments:"dashboard"
            };
            var req = {
                method  : 'GET', 
                body    : false,
                token   : vm.user.token, 
                params  : {hubId:"all"}, 
                hasFile : false, 
                cache   : true,
                route   : r
            };

            // QueryService
            //     .query(req)
            //     .then(function (response) { 
            //         vm.dashboardData = response.data.data;
            //         vm.pickups      = vm.dashboardData.pickups;
            //         vm.deliveries   = vm.dashboardData.deliveries;
            //         google.charts.load("current", {packages:["corechart"]});
            //         google.charts.setOnLoadCallback(drawChart);
            //         google.charts.setOnLoadCallback(drawPickupChart);
            //     }, function (error) {
            //         logger.error(error.data.errors[0].context, error, error.data.errors[0].message);
            //         vm.isLoading = false;
            //     }); 

            GoogleCharts.load(drawCharts);
        }

        function getPerformance (hub, params, key) {

            var r = {
                express:"",
                couriers:"",
                performance:""
            };
            // if(hub) {
                var parameters = {
                    // startDate: params.start,
                    // endDate:params.end,
                    // hubId: hub.id || vm.user.hubId,
                    courier:key
                };
            // } 

            var req = {
                method  : 'GET', 
                body    : false,
                token   : vm.user.token, 
                params  : parameters, 
                hasFile : false, 
                cache   : true,
                route   : r
            };

            // reset
            vm.items = {
                grandTotal: 0,
                totalCompleted: 0,
                totalNottempt: 0,
                totalAttempted: 0,
                totalEfficiency: 0
            };

            QueryService
                .query(req)
                .then(function (response) { 
                    vm.couriers = response.data.data.items;
                    for (var i in vm.couriers) {
                        if (vm.couriers.hasOwnProperty(i)) {
                            vm.items.grandTotal += vm.couriers[i].total;
                            vm.items.totalCompleted += vm.couriers[i].completed;
                            vm.items.totalAttempted += vm.couriers[i].attempted;
                            vm.items.totalNottempt += vm.couriers[i].unattempted;
                            vm.couriers[i].efficiency = vm.round((((vm.couriers[i].attempted + vm.couriers[i].completed) / vm.couriers[i].total)*100));
                            vm.items.totalEfficiency += vm.couriers[i].efficiency;
                        }
                    }

                    vm.items.totalEfficiency = vm.round((vm.items.totalEfficiency / Object.keys(vm.couriers).length)*100)/100 ;
                }, function (error) {
                    vm.isLoading = false;
                    logger.log(error.data.errors[0].context, error, error.data.errors[0].message);
                });
        }
    

        function drawChart() {
            var data = {"No Attempt":vm.deliveries.ongoing,"Unsuccessful":vm.deliveries.failed,"Successful":vm.deliveries.completed};
            vm.deliveryData = Object.keys(data).map(function(key) {
              return [key, data[key]];
            });
            vm.deliveryData.unshift(["Deliveries",""]);
            var newData = google.visualization.arrayToDataTable(vm.deliveryData);
            var chart = new google.visualization.PieChart(vm.deliveryChart);
            chart.draw(newData, UTILS.deliveryChartOptions);
        }


        function drawPickupChart() {
            var data = {"No Attempt":vm.pickups.ongoing,"Unsuccessful":vm.pickups.failed,"Successful":vm.pickups.completed};

            vm.pickupsData = Object.keys(data).map(function(key) {
                return [key, data[key]];
            });
                vm.pickupsData.unshift(["Pickups",""]);
                var newData = google.visualization.arrayToDataTable(vm.pickupsData);
                var chart = new google.visualization.PieChart(vm.pickupsChart);
                chart.draw(newData, UTILS.deliveryChartOptions);
        }


        function getVehicles (hub) {
            vm.list = [];
            vm.vehicles = [];
            vm.isLoading = true;
            var route = {
                express:"",
                vehicles:"out-del"
            };
            var params = {
                all: true,
            };

            var req =  {
                method  : 'GET', 
                body    : false,
                token   : vm.user.token, 
                params  : params, 
                hasFile : false, 
                cache   : true,
                route   : route
            };
        
            QueryService
                .query(req)
                .then(function (response) {
                    vm.vehicles = response.data.data.items;
                    getMap (vm.vehicles);
                    vm.isLoading = false;
               }, function (error) {
                    if(error.data.errors) {
                        logger.error(error.data.errors[0].message, error, error.data.errors[0].context);
                    } else {
                        logger.error(error.statusText, error,'');
                    }
                    vm.isLoading = false;
            });
        }

        function drawCharts() {
            GLOBAL.drawChart(vm.delivery_data, 'deliveriesChart');
            GLOBAL.drawChart(vm.pickup_data, 'pickupsChart');
        }

        function goToPickups(view) {
            $state.go("app.pickups", {page:1, size:10, view:view});
        }

        function goToDeliveries(view) {
            $state.go("app.deliveries", {page:1, size:10, view:view});
        }
        
        function dashboardUpdate () {
             socket.on('dashboardUpdates', function (data) {
                init();
            });
        }
    }
})();
