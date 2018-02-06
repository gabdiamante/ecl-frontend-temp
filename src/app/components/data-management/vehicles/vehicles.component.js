import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('vehicles', {
        template: require('./vehicles.html'),
        controller: VehiclesCtrl,
        controllerAs: 'vm'
    });

    VehiclesCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function VehiclesCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Vehicles';
    }
})();
