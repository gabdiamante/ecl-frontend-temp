import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('packagingCodeDetails', {
        template: require('./packaging-code-details.html'),
        controller: PackagingCodeDetailsCtrl,
        controllerAs: 'vm'
    });

    PackagingCodeDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PackagingCodeDetailsCtrl(
        $scope,
        $state,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.route_name = 'packaging_code';
        vm.title = 'Packaging Code';
        vm.titleHeader = vm.title + ' Details';

        vm.handleUpdateItem = handleUpdateItem;

        vm.$onInit = function() {
            vm.TPLS = 'packagingCodeFormModal';
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
                        console.log('packaging code', response);
                        vm.item_details = response.data.data.items[0];
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(item) {
            var modal = {
                title: vm.title,
                titleHeader: 'Edit ' + vm.title
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
                    console.log(error);
                }
            );
        }
    }
})();
