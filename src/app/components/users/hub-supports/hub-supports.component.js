import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('hubSupports', {
        template: require('./hub-supports.html'),
        controller: HubSupportsCtrl,
        controllerAs: 'vm'
    });

    HubSupportsCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function HubSupportsCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Hub Supports';
    }
})();
