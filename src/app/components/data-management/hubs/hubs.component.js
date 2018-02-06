import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('hubs', {
        template: require('./hubs.html'),
        controller: HubsCtrl,
        controllerAs: 'vm'
    });

    HubsCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function HubsCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Hubs';
    }
})();
