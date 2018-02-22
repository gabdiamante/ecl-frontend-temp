import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MESSAGE from 'Helpers/message';

(function() {
    // 'use strict';

    angular.module('app').component('customerSupportForm', {
        template: require('./customer-support-form.html'),
        controller: customerSupportFormCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    customerSupportFormCtrl.$inject = [
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

    function customerSupportFormCtrl(
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
        vm.sites            = [];

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
            getSites();
        }

        function getSites() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1', 
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
                        vm.sites = response.data.data.items; 
                        vm.data.site_id = (vm.method=='POST') ? vm.sites[0].id : vm.data.site_id;
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
            if (Request.route.site) Request.route.site = data.site_id;
            QueryService
                .query(Request)
                .then(
                    function(response) { 
                        logger.success(MESSAGE.loggerSuccess('Customer Support', Request.method));
                        vm.modalInstance.close(data);
                    },
                    function(err) {
                        logger.error(MESSAGE.loggerFailed('Customer Support', Request.method));
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
