import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('hubDetails', {
        template: require('./hub-details.html'),
        controller: HubDetailsCtrl,
        controllerAs: 'vm'
    });

    HubDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function HubDetailsCtrl(
        $scope,
        $state,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Hub Details';
        vm.handleUpdateItem = handleUpdateItem;

        vm.$onInit = function() {
            vm.TPLS = 'hubFormModal';

            vm.item_details =
                $filter('filter')(
                    DUMMY.hubs,
                    { id: parseInt($state.params.id) },
                    true
                )[0] || {};
            console.log($state.params.id, vm.item_details);
        };

        function handleUpdateItem(details) {
            var modal = {
                titleHeader: 'Edit Hub'
            };

            var request = {
                body: details
            };

            formModal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                    }
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }

        function formModal(request, modal, template, size) {
            return ModalService.form_modal(request, modal, template, size);
        }
    }
})();
