import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('personnelDetails', {
        template: require('./personnel-details.html'),
        controller: PersonnelDetailsCtrl,
        controllerAs: 'vm'
    });

    PersonnelDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PersonnelDetailsCtrl(
        $scope,
        $state,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Personnel Details';
        vm.route_name = 'personnel';

        vm.handleUpdateItem = handleUpdateItem;

        vm.$onInit = function() {
            vm.TPLS = 'personnelFormModal';
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
                        console.log('dispatcher', response);
                        vm.item_details = response.data.data.items[0];
                    },
                    function(err) {
                        vm.item_details = {};
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(item) {
            var modal = {
                title: 'Dispatcher',
                titleHeader: 'Edit Dispatcher',
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
    }
})();
