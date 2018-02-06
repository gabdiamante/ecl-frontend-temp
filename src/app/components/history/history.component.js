import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('history', {
        template: require('./history.html'),
        controller: HistoryCtrl,
        controllerAs: 'vm'
    });

    HistoryCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function HistoryCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'History';
    }
})();
