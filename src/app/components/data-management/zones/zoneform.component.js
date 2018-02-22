import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MSG from 'Helpers/message';
import CONSTANTS from 'Helpers/constants';

(function() {
    'use strict';

    angular.module('app').component('zonesFormModal', {
        template: require('./zoneform.html'),
        controller: ZonesFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    ZonesFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function ZonesFormModalCtrl(
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

            console.log('data', vm.data);
            vm.storeData = [];

            vm.site_type = angular.copy(vm.data.type || vm.Modal.site_type);

            getTypes();
            getSites();
        };

        function getTypes() {
            vm.site_types = angular.copy(CONSTANTS.site_types);
            vm.site_type = angular.copy(vm.site_type || vm.site_types[0].code);
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
                        console.log('sites', response);
                        vm.sites = response.data.data.items;
                        vm.sites.unshift({ id: null, code: 'Unassign Site' });
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

        function changeSiteType(item) {
            vm.data.site_id = null;
            getSites();
        }

        function save(data) {
            vm.disable = true;

            vm.Request.body = vm.data;

            console.log('New Request', vm.Request);
            QueryService.query(vm.Request)
                .then(
                    function(response) {
                        if (vm.Request.method === 'POST') {
                            logger.success(vm.Modal.title + ' added');
                            response.data.data.dateCreated = new Date();
                        } else if (vm.Request.method === 'PUT') {
                            logger.success(vm.Modal.title + ' updated');
                        }
                        close(response.data.data);
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.disable = false;
                });
        }

        function close(data) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
