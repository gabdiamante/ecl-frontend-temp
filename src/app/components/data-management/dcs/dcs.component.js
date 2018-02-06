import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('dcs', {
        template: require('./dcs.html'),
        controller: DistributionCentersCtrl,
        controllerAs: 'vm'
    });

    DistributionCentersCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DistributionCentersCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Distribution Centers';
    }
})();
