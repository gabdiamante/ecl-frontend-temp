import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

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

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            console.log(vm.data);
            vm.storeData = [];

            getHubs();
            getZones();
        };

        function getHubs() {
            vm.loading = true;
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
                        // vm.total_items          = response.data.data.total;
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function getZones() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1,
                    site_type: 'DC'
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
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function save(data) {
            vm.oldZoneId = angular.copy(vm.Request.body.zone_id);
            vm.disable = true;
            vm.loading = true;

            vm.data.type = 'DC';
            vm.Request.body = {
                name: vm.data.name,
                code: vm.data.code,
                hub_id: vm.data.hub_id,
                type: vm.data.type,
                address: vm.data.address,
                lat: vm.data.lat,
                lng: vm.data.lng
            };

            console.log('req', vm.Request);

            if (vm.Modal.method == 'add') {
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            if (vm.data.zone_id) updateZone(response);
                            else
                                executeClosing(
                                    response.data.data.items[0] || {}
                                );
                        },
                        function(error) {
                            logger.error(error.data.message);
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            } else if (vm.Modal.method == 'edit') {
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            if (vm.data.zone_id) updateZone(response);
                            else unassignZone(response);
                        },
                        function(err) {
                            logger.error(error.data.message);
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            }
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
                        logger.error(error.data.message);
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
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function executeClosing(item, response_zone) {
            if (vm.Modal.method == 'add') {
                logger.success(vm.Modal.title + ' added.');
            } else if (vm.Modal.method == 'edit') {
                logger.success(vm.Modal.title + ' updated.');
            }

            vm.response_data = item;

            if (response_zone) {
                var response_zone_data = response_zone.data.data.items[0] || {};
                vm.response_data.zone_id = response_zone_data.id;
                vm.response_data.zone_code = response_zone_data.code;
            }

            close(vm.response_data);
        }

        function close(data) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
