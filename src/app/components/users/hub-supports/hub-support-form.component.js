import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('hubSupportForm', {
        template: require('./hub-support-form.html'),
        controller: hubSupportFormCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    hubSupportFormCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'ModalService',
        'logger'
    ];

    function hubSupportFormCtrl(
        $rootScope,
        $state,
        $cookies,
        $scope,
        $stateParams,
        $filter,
        QueryService,
        ModalService,
        logger
    ) {
        var vm              = this;
        var Modal           = null;
        var Request         = null;
        vm.user             = {}; 
        vm.selected_accoutn = '';
        vm.submitted        = false;
        vm.route_name       = 'site';

        vm.$onInit = function() {
            Modal           = vm.resolve.Modal;
            Request         = vm.resolve.Request;
            vm.titleHeader  = Modal.header;
            vm.data         = angular.copy(Request.body);
        };

        vm.save             = save;
        vm.cancel           = cancel;

        init();

        function init() {
            getData();
        }

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1',
                    type: 'HUB',
                    is_active: vm.deleted == 'true' ? 0 : 1
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: true,
                cache_string: vm.route_name
            }; 

            QueryService
                .query(request)
                .then(
                    function(response) { 
                        vm.hubs = response.data.data.items; 
                        vm.data.hub_id = vm.hubs[0].id; // temporary
                    },
                    function(err) {
                        console.log(err);
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function save(data) { 
            vm.disable = true;
            Request.body = angular.copy(data);
            QueryService
                .query(Request)
                .then(
                    function(response) { 
                        console.log(response);
                        vm.modalInstance.close(data);
                    },
                    function(err) {
                        console.log(err);
                        // logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() { 
                    vm.loading = false; 
                    vm.disable = false; 
                });
        }

        function cancel() {
            vm.modalInstance.close(false);
        }
    }
})();
