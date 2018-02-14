import angular from 'angular';
import GLOBAL from 'Helpers/global';

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

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            vm.storeData = [];

            //console.log(Modal);
        };

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            vm.data.type = 'HUB';
            vm.Request.body = vm.data;

            if (vm.Modal.method == 'add') {
                console.log(vm.Modal.method);
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            console.log('hubsss', response);
                            logger.success(vm.Modal.title + ' added.');
                            close(vm.data, action);
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
                            console.log('hub', response);
                            logger.success(vm.Modal.title + ' updated.');
                            close(vm.data, action);
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

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
