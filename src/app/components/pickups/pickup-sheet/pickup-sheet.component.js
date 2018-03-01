import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import UTILS from 'Helpers/util';

(function (){
    'use strict';

    angular.module('app').component('pickupSheet', {
        template: require('./pickup-sheet.html'),
        controller: PickupSheetCtrl,
        controllerAs: 'vm'
    });

    PickupSheetCtrl.$inject = [
        '$scope', 
        '$state',
        '$stateParams',
        '$cookies',
        '$filter',
        '$timeout',
        'ModalService', 
        'QueryService',
        'logger'
    ];

    function PickupSheetCtrl ($scope, $state, $stateParams, $cookies, $filter, $timeout, ModalService, QueryService,logger) {
       
        var vm  = this;
        vm.getManifest = getManifest;
        vm.today = new Date();
        vm[$stateParams.vehicle] = true;
        vm.allManifest = true;
        vm.courier = $stateParams.courier;
        vm.vehicleId = $stateParams.vehicleId;
        vm.round = window.Math.round;
        vm.manifestDate = new Date($stateParams.date);
        vm.totalD = 0;
        vm.totalW = 0;
        vm.logo = UTILS.logo;
        vm.parseJSON = JSON.parse;

        init();
        function init () {
            console.log('sss');
            if($stateParams.courierId) {
                getOneManifest ();
                vm.allManifest = false;
            } else {
                getAllManifest();
                vm.allManifest = true;
            }
        }
        
        function getAllManifest () {
            vm.isLoading = true;
           
            vm.route = {
                express:"",
                bookings:"",
                couriers:"",
                manifest:""
            };

            var params = {
                date: $stateParams.date,
                hubId:$stateParams.hubId
            };
            var req = {
                method  : 'GET', 
                ignoreLoadingBar:true,
                body    : false,
                params  : params, 
                hasFile : false, 
                cache   : true,
                route   : vm.route
            };

            console.log('sss');
            vm.manifests = DUMMY.manifests;

            QueryService
                .query(req)
                .then(function (response) { 
                    
                    //vm.manifests = response.data.data;
                    vm.isLoading = false;
                }, function (error) {
                    vm.isLoading = false;
                   if(error.status == -1) {
                        logger.error('', error, 'Cannot connect to server.');
                    } else {
                        logger.error(error.data.errors[0].context, error, error.data.errors[0].message );
                    }
                });
        }

        // express/bookings/couriers/manifest?date=2017-08-10
        function getOneManifest () {
            vm.isLoading = true;
           
            vm.route = {
                express:"",
                bookings:"",
                courier:$stateParams.courierId,
                manifest:""
            };

            var params = {
                date: $stateParams.date,
                hubId:$stateParams.hubId
            };
            var req = {
                method  : 'GET', 
                ignoreLoadingBar:true,
                body    : false,
                params  : params, 
                hasFile : false, 
                cache   : true,
                route   : vm.route
            };

            QueryService
                .query(req)
                .then(function (response) { 
                    console.log(response);
                    vm.manifests = response.data.data;
                    vm.isLoading = false;
                }, function (error) {
                    vm.isLoading = false;
                   if(error.status == -1) {
                        logger.error('', error, 'Cannot connect to server.');
                    } else {
                        logger.error(error.data.errors[0].context, error, error.data.errors[0].message );
                    }
                });
        }
        
        vm.tableHead = {
            bkngNo   : "Booking No.",            
            shpr     : "Shipper's Name",
            pcs      : "Pcs",
            weight   : "Weight (kg)",
            cbm      : "CBM",
            rem      : "Remarks"
        };
    }

})();