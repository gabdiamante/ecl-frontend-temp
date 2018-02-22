import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MESSAGE from 'Helpers/message';

(function() {
    // 'use strict';

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
        vm.hubs             = [];

        vm.$onInit = function() {
            Modal           = vm.resolve.Modal;
            Request         = vm.resolve.Request;
            vm.titleHeader  = Modal.header;
            vm.data         = angular.copy(Request.body) || {};
            vm.method       = angular.copy(Request.method);
        };

        vm.save             = save;
        vm.cancel           = cancel;

        init();

        function init() {
            getHubs();
        }

        function getHubs() {
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

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.hubs = response.data.data.items; 
                        vm.data.site_id = (vm.method=='POST') ? vm.hubs[0].id : vm.data.site_id;
                    },
                    function(err) {
                        console.log(err); 
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function save(data) {
            vm.disable = true;
            Request.body = angular.copy(data);
            // if (Request.method=='PUT') Request.route.site = data.site_id;
            QueryService
                .query(Request)
                .then(
                    function(response) { 
                        logger.success(MESSAGE.loggerSuccess('Hub Support', Request.method));
                        vm.modalInstance.close(data);
                    },
                    function(err) {
                        logger.error(MESSAGE.loggerFailed('Hub Support', Request.method));
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
