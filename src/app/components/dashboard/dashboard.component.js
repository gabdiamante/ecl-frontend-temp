import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';

(function() {
    'use strict';

    angular.module('app').component('dashboard', {
        template: require('./dashboard.html'),
        controller: DashboardCtrl,
        controllerAs: 'vm'
    });

    DashboardCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DashboardCtrl($scope, $state, ModalService, QueryService, logger) {
        var vm = this;
        vm.titleHeader = 'Dashboard';
    }
})();
