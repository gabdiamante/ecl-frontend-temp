import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('vehicleDetails', {
        template: require('./vehicle-details.html'),
        controller: VehicleDetailsCtrl,
        controllerAs: 'vm'
    });

    VehicleDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function VehicleDetailsCtrl(
        $scope,
        $state,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Vehicle Details';
        vm.handleUpdateItem = handleUpdateItem;

        //temporary
        $scope.$watch(
            'vm.item_details',
            function(new_val, old_val) {
                joinHubs(new_val);
            },
            true
        );

        vm.$onInit = function() {
            vm.TPLS = 'vehicleFormModal';

            vm.item_details =
                $filter('filter')(
                    DUMMY.vehicles,
                    { id: $state.params.id },
                    true
                )[0] || {};
            console.log($state.params.id, vm.item_details);
        };

        function handleUpdateItem(item) {
            var modal = {
                title: 'Vehicle',
                titleHeader: 'Edit Vehicle',
                method: 'edit'
            };

            var request = {
                method: 'GET',
                body: item,
                params: {
                    per_page: 10,
                    page: 1
                },
                hasFile: false,
                route: { users: '' },
                cache: false
            };

            formModal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        console.log(response);
                        vm.item_details = response;
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

        function joinHubs(item) {
            item.hub_name = $filter('filter')(
                DUMMY.sites,
                { id: item.hub_id, type: 'HUB' },
                true
            )[0].name;
        }
    }
})();
