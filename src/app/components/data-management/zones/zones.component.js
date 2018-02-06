import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('zones', {
        template: require('./zones.html'),
        controller: ZonesCtrl,
        controllerAs: 'vm'
    });

    ZonesCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function ZonesCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Zones';
    }
})();
