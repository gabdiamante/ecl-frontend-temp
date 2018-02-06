import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('monitoring', {
        template: require('./monitoring.html'),
        controller: MonitoringCtrl,
        controllerAs: 'vm'
    });

    MonitoringCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function MonitoringCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Monitoring';
    }
})();
