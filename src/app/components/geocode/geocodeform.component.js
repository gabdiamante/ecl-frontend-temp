import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MSG from 'Helpers/message';
import CONSTANTS from 'Helpers/constants';

(function (){
    'use strict';

    angular.module('app').component('geocodeFormModal', {
        template: require('./geocodeform.html'),
        controller: GeocodeFormCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    GeocodeFormCtrl.$inject = [
        '$scope', 
        '$state', 
        '$stateParams', 
        '$cookies',
        '$cacheFactory',
        '$filter',
        '$timeout',
        'QueryService', 
        'ModalService',
        'logger',
        'NgMap'
    ];


    function GeocodeFormCtrl ($scope, $state, $stateParams, $cookies, $cacheFactory, $filter,$timeout,
        QueryService, ModalService, logger, NgMap) {
        
        var vm = this;
        var httpCache = $cacheFactory.get('$http');
    
        vm.incomplete = true;

        vm.save=save;
        vm.close = close;
        vm.cancel = cancel;
        vm.getLoc=getLoc;
        vm.codeAddress=codeAddress;
        vm.getPosition=getPosition;
        vm.placeChanged=placeChanged;
        vm.geocoder = new google.maps.Geocoder();

        var Modal = null;
        var Request = null;

        vm.$onInit = function() {
            
            Modal = vm.resolve.Modal;
            Request = vm.resolve.Request;

            vm.titleHeader=Modal.titleHeader;
            vm.storeData = [];
            vm.manila = "14.599512, 120.984222";
            vm.user = GLOBAL.user($cookies, $state);
            vm.data = angular.copy(Request.body);

            console.log('data', vm.data);

            getMap();
        };

        function getMap () {
             NgMap.getMap({id:'geocode'}).then(function(map) {
                vm.geocodeMap = map;
                google.maps.event.trigger(map,'resize');
            });
        }

        function save (data) {

            var params = {};
            var body = {
                fullAddress:data.address,
                new_address:vm.data.newAddress,
                lat:data.position[0],
                lng:data.position[1]
            };

            var req =  {
                    method  : 'PUT', 
                    body    : body,
                    token   : vm.user.token, 
                    params  : params, 
                    hasFile : false, 
                    cache   : false,
                    route   : Request.route,
                    cache_string:['deliveries', 'pickups']
            };
            sendQuery(req);
        }

        function sendQuery(req) {
            QueryService
                .query(req)
                .then(function (response) {
                    logger.success(MSG.updateSuccess + 'address','',response.data.message);
                    close(response);
                }, function (error) {
                    console.log(error);
                    if(error.data.errors) {
                        logger.error(error.data.errors[0].message, error, error.data.errors[0].context);
                    } else {
                        logger.error(error.data.message, '',error.statusText);
                    }
            });
        }

        function getLoc (loc) {
            vm.lat = loc.latLng.lat();
            vm.lng = loc.latLng.lng();
            
            // vm.center=vm.lat + ',' +  vm.lng;
            vm.zoom=16;
            vm.data.position = [vm.lat, vm.lng]; 
            getPositionAddress(vm.lat, vm.lng);
        }

        function getPositionAddress(lat,lng){
            vm.zoom = 18;
            var latlng = new google.maps.LatLng(lat, lng);
            vm.disable = true;
            vm.geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == 'OK') {
                if (results[0]) {
                    $scope.$apply(function () {
                        vm.data.newAddress = results[0].formatted_address;
                    });
                    console.log(vm.data.newAddress);
                }else {
                    logger.error('Location not found');                    
                } 
            } else {
                logger.error('Geocoder failed due to: ' + status); 
            }
            
            });
        }


        function codeAddress(address) {
            vm.geocoder.geocode( { 'address': address}, function(results, status) {
                console.log(results, status);
              if (status == 'OK') {
                vm.incomplete =false;
                var locatedAddress = results[0].geometry.location;
                vm.geocodeMap.setCenter(results[0].geometry.location);
                $scope.$apply(function () {
                    vm.data.newAddress = results[0].formatted_address;
                    var lat = locatedAddress.lat();
                    var lng = locatedAddress.lng();
                    vm.center = lat + "," + lng;
                    vm.data.position = [lat, lng];   
                });
              } else {
                vm.incomplete = true;
                logger.error('Google cannot locate address.');
              }
            });
          }

        function placeChanged(event, loc)  {

            vm.data.position = [];
            vm.data.newAaddress = vm.address;
            codeAddress(loc);

                // vm.incomplete =false;
                // vm.place.geometry.latLng = vm.place.geometry.location;
                // var lat = vm.place.geometry.location.lat();
                // var lng = vm.place.geometry.location.lng();
                // vm.center = lat + "," + lng;
                // vm.data.position = [lat, lng];              
        }

        function getPosition (event) {

            vm.data.position = [];
            vm.address = "";
            vm.lat = event.latLng.lat();
            vm.lng = event.latLng.lng();
            vm.data.position = [vm.lat, vm.lng]; 
            getPositionAddress(vm.lat, vm.lng);                            
            vm.incomplete=false;
        }

        function assignLatLng () {

        }

        function close(data) {
            vm.modalInstance.close(data);
        }

        function cancel () {
            vm.modalInstance.close();
        }  

    } //controller

})();


