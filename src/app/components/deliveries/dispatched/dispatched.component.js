import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('deliveriesDispatched', {
        template: require('./dispatched.html'),
        controller: DeliveriesDispatchedCtrl,
        controllerAs: 'vm'
    });

    DeliveriesDispatchedCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DeliveriesDispatchedCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Dispatched';
    }
})();
