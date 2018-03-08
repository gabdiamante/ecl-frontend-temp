import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import CONSTANTS from 'Helpers/constants';
import MESSAGE from 'Helpers/message';

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
            getVehicleType();
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
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
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
                        console.log(error);
                        logger.error(MESSAGE.loggerFailed(vm.title, Request.method));
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
