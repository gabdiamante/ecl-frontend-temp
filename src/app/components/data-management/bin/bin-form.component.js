import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import CONSTANTS from 'Helpers/constants';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('binFormModal', {
        template: require('./bin-form.html'),
        controller: BinFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    BinFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function BinFormModalCtrl(
        $rootScope,
        $state,
        $cookies,
        $scope,
        $stateParams,
        $filter,
        QueryService,
        logger
    ) {
        var vm = this;

        // methods
        vm.save = save;
        vm.cancel = cancel;

        vm.changeSiteType = changeSiteType;

        var Modal = null;
        var Request = null;

        vm.$onInit = function() {
            Request = vm.resolve.Request;
            Modal = vm.resolve.Modal;

            vm.titleHeader = Modal.titleHeader;
            vm.title = Modal.title;
            vm.data = angular.copy(Request.body);
            vm.storeData = [];

            getSiteTypes();

            getSites();
            getDestinations();
            getZones();
            //console.log(Modal);
        };

        function getSiteTypes() {
            vm.site_types = CONSTANTS.site_types;
            vm.site_type = vm.site_type || vm.site_types[0].code;
        }

        function getSites() {
            vm.loadingSites = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1,
                    type: vm.site_type
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.sites = response.data.data.items;
                        vm.sites.unshift({ code: 'Select Sites' });
                        vm.data.site_id = vm.data.site_id || vm.sites[0].id;
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingSites = false;
                });
        }

        function getDestinations() {
            vm.loadingDestinations = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1,
                    type: 'DC'
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.destinations = response.data.data.items;
                        vm.destinations.unshift({ code: 'Select Destination' });
                        vm.data.dc_id = vm.data.dc_id || vm.destinations[0].id;
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingDestinations = false;
                });
        }

        function getZones() {
            vm.loadingZones = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1
                },
                hasFile: false,
                route: { zone: '' },
                cache: false
            };

            console.log('zone r', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('zones', response);
                        vm.zones = response.data.data.items;
                        vm.zones.unshift({ code: 'Select Zone' });
                        vm.data.zone_id = vm.data.zone_id || vm.zones[0].id;
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingZones = false;
                });
        }

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            Request.body = vm.data;

            QueryService.query(Request)
                .then(
                    function(response) {
                        var response_data = response.data.data.items[0] || {};
                        logger.success(
                            MESSAGE.loggerSuccess(vm.title, Request.method)
                        );
                        vm.modalInstance.close(response_data);
                    },
                    function(error) {
                        logger.error(
                            MESSAGE.loggerFailed(vm.title, Request.method)
                        );
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                    vm.disable = false;
                });
        }

        function changeSiteType(item) {
            //vm.data.site_id = null; //temporary
            getSites();
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
