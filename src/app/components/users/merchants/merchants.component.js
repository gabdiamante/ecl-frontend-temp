import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('merchants', {
        template: require('./merchants.html'),
        controller: MerchantsCtrl,
        controllerAs: 'vm'
    });

    MerchantsCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function MerchantsCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Merchants';
    }
})();
