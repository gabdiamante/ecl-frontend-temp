import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import UTILS from 'Helpers/util';

;(function (){
    'use strict';

    angular.module('app').component('cmrDrsSheet', {
        template: require('./cmr-drs.html'),
        controller: CmrDrsSheetCtrl,
        controllerAs: 'vm'
    });

    CmrDrsSheetCtrl.$inject = [
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

    function CmrDrsSheetCtrl ($scope, $state, $stateParams, $cookies, $filter, $timeout, ModalService, QueryService,logger) {
       
        var vm  = this;
        // vm.user = GLOBAL.user($cookies, $state);
        vm.getManifest = getManifest;
        vm.today = $filter('date')(new Date(), "yyyy-MM-dd");
        vm[$stateParams.vehicle] = true;
        vm.courier = $stateParams.courier;
        vm.vehicleId = $stateParams.vehicleId;
        vm.round = window.Math.round;
        vm.manifestDate = new Date($stateParams.date);
        vm.totalD = 0;
        vm.totalW = 0;
        vm.logo = UTILS.logo;
        vm.parseJSON = angular.fromJson;

        init();
        function init () {
            if($stateParams.id) {
                getOneManifest(); 
            } else {
                getAllManifests();
            }
            
        }

        function getAllManifests () {
            vm.isLoading = true;
            // /express/assignments/manifest
            var r = {
                express:'',
                assignments : '',
                manifest : ''
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
                route   : r,
                cache_string:'print-all'
            };

            vm.manifests = DUMMY.manifests;

            QueryService
                .query(req)
                .then(function (response) { 
                    console.log(response);
                    vm.manifests = response.data.data;
                    vm.isLoading = false;
                }, function (error) {
                    console.log(error);
                    vm.isLoading = false;
                   if(error.status == -1) {
                        logger.error('', error, 'Cannot connect to server.');
                    } else {
                        logger.error(error.data.errors[0].context, error, error.data.errors[0].message );
                    }
                });
        }

        function getOneManifest () {
            vm.isLoading = true;
            // /express/assignments/courier/:id/manifest
            var r = {
                express:'',
                assignments : '',
                courier:$stateParams.id,
                manifest : ''
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
                route   : r,
                cache_string:'print'
            };

            QueryService
                .query(req)
                .then(function (response) { 
                    console.log(response);
                    vm.manifests = response.data.data;
                    vm.isLoading = false;
                }, function (error) {
                    console.log(error);
                    vm.isLoading = false;
                   if(error.status == -1) {
                        logger.error('', error, 'Cannot connect to server.');
                    } else {
                        logger.error(error.data.errors[0].context, error, error.data.errors[0].message );
                    }
                });
        }
    }

})();