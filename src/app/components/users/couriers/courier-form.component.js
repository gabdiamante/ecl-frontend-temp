import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('courierForm', {
        template: require('./courier-form.html'),
        controller: CourierFormCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    CourierFormCtrl.$inject = [
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

    function CourierFormCtrl(
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
        vm.sites            = [];
        vm.user             = {};
        vm.item             = {}; 
        vm.submitted        = false;

        vm.$onInit = function() {
            Modal           = vm.resolve.Modal;
            Request         = vm.resolve.Request;
            vm.titleHeader  = Modal.header;
            vm.data         = angular.copy(Request.body);
            vm.method       = angular.copy(Request.method); 
        };

        vm.save             = save;
        vm.cancel           = cancel;

        init();

        function init() {
            getSites();
        }

        function getSites() {
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1', 
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: true,
                cache_string: 'sites'
            }; 

            QueryService
                .query(request)
                .then(
                    function(response) { 
                        vm.sites = response.data.data.items; 
                    },
                    function(error) {
                        logger.error(error.data.message);
                        //logger.error(MESSAGE.error, err, '');
                    }
                );
        }

        function save(data) { 
            Request.body = data; 
            vm.disable = true; 
            QueryService
                .query(Request)
                .then(
                    function(response) { 
                        logger.success(MESSAGE.loggerSuccess('Courier', Request.method));
                        vm.modalInstance.close(data);
                    },
                    function(err) {
                        logger.error(MESSAGE.loggerSuccess('Courier', Request.method));
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
