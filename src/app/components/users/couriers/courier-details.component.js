import angular from 'angular';
import GLOBAL from 'Helpers/global';

(function() {
    'use strict';

    angular.module('app').component('courierDetails', {
        template: require('./courier-details.html'),
        controller: CourierDetailsCtrl,
        controllerAs: 'vm'
    });

    CourierDetailsCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function CourierDetailsCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Courier Details';
    }
})();
