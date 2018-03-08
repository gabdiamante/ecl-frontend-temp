import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('hubFormModal', {
        template: require('./hub-form.html'),
        controller: HubFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    HubFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function HubFormModalCtrl(
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
            vm.storeData = [];
        };

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            vm.data.type = 'HUB';
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
                        console.log(err);
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

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
