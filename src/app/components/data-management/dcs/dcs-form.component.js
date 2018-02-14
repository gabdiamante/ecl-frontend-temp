import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('distributionCenterFormModal', {
        template: require('./dcs-form.html'),
        controller: DCFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    DCFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function DCFormModalCtrl(
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
            getZones();
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

        function getZones() {
            vm.zones = angular.copy(DUMMY.zones) || [];
            vm.zones.unshift({ code: 'Select Zones' });
            vm.data.zone_id = vm.data.zone_id || vm.zones[0].id;
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
