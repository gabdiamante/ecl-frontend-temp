import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

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

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            console.log(vm.data);
            vm.storeData = [];

            getHubs();
            getType();
            //console.log(Modal);
        };

        function getHubs() {
            vm.hubs =
                $filter('filter')(
                    angular.copy(DUMMY.sites),
                    { type: 'HUB' },
                    true
                ) || [];
            vm.hubs.unshift({ code: 'Select Hub' });
            vm.data.hub_id = vm.data.hub_id || vm.hubs[0].id;
        }

        function getType() {
            vm.types = [
                { name: 'Motorcycle', value: '2W' },
                { name: 'Truck', value: '4W' }
            ];

            vm.types.unshift({ name: 'Select Type' });
            vm.data.type = vm.data.type || vm.types[0].id;
        }

        function save(data, action) {
            vm.disable = true;

            if (vm.Modal.method == 'add') {
                logger.success(vm.Modal.title + ' added.');
                close(vm.data, action);
            } else if (vm.Modal.method == 'edit') {
                logger.success(vm.Modal.title + ' updated.');
                close(vm.data, action);
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

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
