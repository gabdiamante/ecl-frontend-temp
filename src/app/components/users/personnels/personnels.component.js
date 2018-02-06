import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('personnels', {
        template: require('./personnels.html'),
        controller: PersonnelsCtrl,
        controllerAs: 'vm'
    });

    PersonnelsCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PersonnelsCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Personnels';
    }
})();
