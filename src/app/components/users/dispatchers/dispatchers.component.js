import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('dispatchers', {
        template: require('./dispatchers.html'),
        controller: DispatchersCtrl,
        controllerAs: 'vm'
    });

    DispatchersCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DispatchersCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Dispatchers';
    }
})();
