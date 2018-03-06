import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('distributionCenterFormModal', {
        template: require('./dcs-form.html'),
        controller: DCFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    DCFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function DCFormModalCtrl(
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

        var Modal = null;
        var Request = null;

        vm.$onInit = function() {
            Modal = vm.resolve.Modal;
            Request = vm.resolve.Request;

            vm.titleHeader = Modal.titleHeader;
            vm.title = Modal.title;
            vm.data = angular.copy(Request.body);
            console.log(vm.data);
            vm.storeData = [];

            getHubs();
            getZones();
        };

        function getHubs() {
            vm.loadingHubs = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    type: 'HUB',
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('hubs', response);
                        vm.hubs = response.data.data.items;
                        vm.hubs.unshift({ code: 'Unassign Hub' });
                        vm.data.hub_id = vm.data.hub_id || vm.hubs[0].id;
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingHubs = false;
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
                    // site_type: 'DC'
                },
                hasFile: false,
                route: { zone: '' },
                cache: false
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('zones', response);
                        vm.zones = response.data.data.items;
                        vm.zones.unshift({ code: 'Unassign Zone' });
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
            vm.oldZoneId = angular.copy(Request.body.zone_id);
            vm.disable = true;
            vm.loading = true;

            vm.data.type = 'DC';
            Request.body = {
                name: vm.data.name,
                code: vm.data.code,
                hub_id: vm.data.hub_id,
                type: vm.data.type,
                address: vm.data.address,
                lat: vm.data.lat,
                lng: vm.data.lng
            };

            QueryService.query(Request)
                .then(
                    function(response) {
                        var response_data = response.data.data.items[0] || {};
                        if (vm.data.zone_id) updateZone(response);
                        else if (Request.method == 'POST' || Request.method == 'PUT')
                            executeClosing(response.data.data.items[0] || {});
                        // else if (Request.method == 'PUT')
                        //     unassignZone(response);
                    },
                    function(error) {
                        console.log(error);
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

        function unassignZone(response) {
            var item = response.data.data.items[0] || {};
            console.log('update_zone', item);

            vm.loading = true;
            var request = {
                method: 'PUT',
                body: { site_id: null },
                params: false,
                hasFile: false,
                route: { zone: vm.oldZoneId },
                cache: false,
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('dcs', response);
                        vm.total_items = response.data.data.total;
                        executeClosing(item, response);
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function updateZone(response) {
            var item = response.data.data.items[0] || {};
            console.log('update_zone', item);

            vm.loading = true;
            var request = {
                method: 'PUT',
                body: { site_id: item.id },
                params: false,
                hasFile: false,
                route: { zone: vm.data.zone_id },
                cache: false,
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('dcs', response);
                        vm.total_items = response.data.data.total;
                        executeClosing(item, response);
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function executeClosing(item, response_zone) {
            logger.success(MESSAGE.loggerSuccess(vm.title, Request.method));
            vm.response_data = item;
            if (response_zone) {
                var response_zone_data = response_zone.data.data.items[0] || {};
                vm.response_data.zone_id = response_zone_data.id;
                vm.response_data.zone_code = response_zone_data.code;
            }
            vm.modalInstance.close(vm.response_data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
