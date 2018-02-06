import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('importExport', {
        template: require('./import-export.html'),
        controller: ImportExportCtrl,
        controllerAs: 'vm'
    });

    ImportExportCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function ImportExportCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Import/Export';
    }
})();
