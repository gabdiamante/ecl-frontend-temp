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
        vm.route_name = 'vehicle';

        vm.handleUpdateItem = handleUpdateItem;

        vm.$onInit = function() {
            vm.TPLS = 'vehicleFormModal';
            getDetails();
        };

        function getDetails() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: $state.params.id },
                cache: false
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('vehicle', response);
                        vm.item_details = response.data.data.items[0];
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(item) {
            var modal = {
                title: 'Vehicle',
                titleHeader: 'Edit Vehicle',
                method: 'edit'
            };

            var request = {
                method: 'PUT',
                body: item,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id },
                cache: false
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        console.log(response);
                        vm.item_details = response;
                    }
                },
                function(error) {
                    logger.error(error.data.message);
                }
            );
        }
    }
})();
