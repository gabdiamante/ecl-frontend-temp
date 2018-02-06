import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('deliveriesBadAddress', {
        template: require('./bad-address.html'),
        controller: DeliveriesBadAddressCtrl,
        controllerAs: 'vm'
    });

    DeliveriesBadAddressCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DeliveriesBadAddressCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Bad Address';
    }
})();
