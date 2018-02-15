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
            //console.log(Modal);
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
                        vm.hubs.unshift({ code: 'Select Hub' });
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

            // vm.hubs =
            //     $filter('filter')(
            //         angular.copy(DUMMY.sites),
            //         { type: 'HUB' },
            //         true
            //     ) || [];
        }

        function getZones() {
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
                route: { zone: '' },
                cache: false
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('zones', response);
                        vm.zones = response.data.data.items;
                        vm.zones.unshift({ code: 'Select Zone' });
                        vm.data.zone_id = vm.data.zone_id || vm.zones[0].id;
                        // vm.total_items          = response.data.data.total;
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });

            // vm.zones = angular.copy(DUMMY.zones) || [];
            // vm.zones.unshift({ code: 'Select Zones' });
            // vm.data.zone_id = vm.data.zone_id || vm.zones[0].id;
        }

        function save(data, action) {
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
                            updateZone(response);
                            // logger.success(vm.Modal.title + ' added.');
                            // close(vm.data, action);
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
                            updateZone(response);
                            // logger.success(vm.Modal.title + ' updated.');
                            // close(vm.data, action);
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

            // QueryService
            //     .query(Request)
            //     .then( function (response) {

            //     }, function (error) {
            //         logger.error(error.data.message || 'Cannot established URL:' + GLOBAL.set_url(Request.route));
            //     }).finally( function () {
            //         vm.disable = false;
            //     });
        }

        function updateZone(response, action) {
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
                        if (vm.Modal.method == 'add') {
                            logger.success(vm.Modal.title + ' added.');
                        } else if (vm.Modal.method == 'add') {
                            logger.success(vm.Modal.title + ' updated.');
                        }

                        vm.response_data = item;
                        var response_zone_data =
                            response.data.data.items[0] || {};
                        vm.response_data.zone_id = response_zone_data.id;
                        vm.response_data.zone_code = response_zone_data.code;

                        close(vm.response_data, action);
                    },
                    function(error) {
                        console.log(error.data.message);
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
