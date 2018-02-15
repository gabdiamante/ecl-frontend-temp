import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('binDetails', {
        template: require('./bin-details.html'),
        controller: BinDetailsCtrl,
        controllerAs: 'vm'
    });

    BinDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function BinDetailsCtrl(
        $scope,
        $state,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Bin Details';
        vm.route_name = 'bin';

        vm.handleUpdateItem = handleUpdateItem;

        //temporary
        // $scope.$watch(
        //     'vm.item_details',
        //     function(new_val, old_val) {
        //         joinHubs(new_val);
        //     },
        //     true
        // );

        vm.$onInit = function() {
            vm.TPLS = 'binFormModal';

            getDetails();

            // vm.item_details =
            //     $filter('filter')(
            //         DUMMY.vehicles,
            //         { id: $state.params.id },
            //         true
            //     )[0] || {};
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
                        console.log('bin response', response);
                        vm.item_details = response.data.data.items[0];
                    },
                    function(err) {
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(item) {
            var modal = {
                title: 'Bin',
                titleHeader: 'Edit Bin',
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

        // function joinHubs(item) {
        //     item.hub_name = $filter('filter')(
        //         DUMMY.sites,
        //         { id: item.hub_id, type: 'HUB' },
        //         true
        //     )[0].name;
        // }
    }
})();
