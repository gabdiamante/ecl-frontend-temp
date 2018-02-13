import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('deliveryDetails', {
        template: require('./delivery-details.html'),
        controller: DeliveryDetailsCtrl,
        controllerAs: 'vm'
    });

    DeliveryDetailsCtrl.$inject = [
        '$filter',
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DeliveryDetailsCtrl(
        $filter,
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Delivery Details';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.loading = false;

        init();

        function init() {
            vm.data = $filter('filter')(DUMMY.users.courier_deliveries, {
                airway_bill: $stateParams.id
            })[0];
            vm.titleHeader = vm.data.airway_bill;
            console.log(vm.data);
        }
    }
})();
