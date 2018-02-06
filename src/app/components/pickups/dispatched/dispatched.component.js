import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('pickupsDispatched', {
        template: require('./dispatched.html'),
        controller: PickupsDispatchedCtrl,
        controllerAs: 'vm'
    });

    PickupsDispatchedCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PickupsDispatchedCtrl(
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
