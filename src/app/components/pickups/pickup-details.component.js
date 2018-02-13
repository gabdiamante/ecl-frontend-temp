import angular from 'angular';
import GLOBAL from 'Helpers/global'; 
import DUMMY from 'Helpers/dummy'; 

(function() {
    'use strict';

    angular.module('app').component('pickupDetails', {
        template: require('./pickup-details.html'),
        controller: PickupDetailsCtrl,
        controllerAs: 'vm'
    });

    PickupDetailsCtrl.$inject = [
        '$filter',
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PickupDetailsCtrl(
        $filter,
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm          = this;
        vm.titleHeader  = 'Pickup Details';
        vm.per_page     = ['10', '20', '50', '100', '200'];
        vm.loading      = false; 

        init();

        function init () {
            vm.data = $filter('filter')(DUMMY.users.courier_pickups, { booking_code:$stateParams.id })[0];
            vm.titleHeader = vm.data.booking_code; 
        } 
        
    } 
})();
