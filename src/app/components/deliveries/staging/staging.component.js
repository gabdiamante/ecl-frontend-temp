import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('deliveriesStaging', {
        template: require('./staging.html'),
        controller: DeliveriesStagingCtrl,
        controllerAs: 'vm'
    });

    DeliveriesStagingCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DeliveriesStagingCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Staging';
    }
})();
