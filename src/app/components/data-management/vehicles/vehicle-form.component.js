import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import CONSTANTS from 'Helpers/constants';

(function() {
    'use strict';

    angular.module('app').component('vehicleFormModal', {
        template: require('./vehicle-form.html'),
        controller: VehicleFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    VehicleFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function VehicleFormModalCtrl(
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

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            vm.storeData = [];

            getSiteTypes();

            getSites();
            getVehicleType();
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
                    type: vm.site_type,
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            };

            console.log('site r', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('site res', response);
                        vm.sites = response.data.data.items;
                        vm.sites.unshift({ code: 'Select Sites' });
                        vm.data.site_id = vm.data.site_id || vm.sites[0].id;
                        // vm.total_items          = response.data.data.total;
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loadingSites = false;
                });
        }

        function getVehicleType() {
            vm.types = [
                { name: 'Motorcycle', value: '2W' },
                { name: 'Truck', value: '4W' }
            ];

            vm.types.unshift({ name: 'Select Type' });
            vm.data.type = vm.data.type || vm.types[0].id;
        }

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            vm.Request.body = vm.data;

            if (vm.Modal.method == 'add') {
                console.log(vm.Modal.method);
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.items[0] || {};
                            logger.success(vm.Modal.title + ' added.');
                            close(response_data, action);
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
                console.log(vm.Request);

                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.items[0] || {};
                            logger.success(vm.Modal.title + ' updated.');
                            close(response_data, action);
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

        function changeSiteType(item) {
            //vm.data.site_id = null; //temporary
            getSites();
        }

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
