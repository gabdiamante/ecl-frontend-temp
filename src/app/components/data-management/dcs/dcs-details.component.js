import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('dcsDetails', {
        template: require('./dcs-details.html'),
        controller: DCsDetailsCtrl,
        controllerAs: 'vm'
    });

    DCsDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DCsDetailsCtrl(
        $scope,
        $state,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Distribution Centers Details';
        vm.handleUpdateItem = handleUpdateItem;

        //temporary
        $scope.$watch(
            'vm.item_details',
            function(new_val, old_val) {
                joinHubs(new_val);
                joinZones(new_val);
            },
            true
        );

        vm.$onInit = function() {
            vm.TPLS = 'distributionCenterFormModal';

            vm.item_details =
                $filter('filter')(
                    DUMMY.sites,
                    { id: parseInt($state.params.id), type: 'DC' },
                    true
                )[0] || {};
            console.log($state.params.id, vm.item_details);
        };

        function handleUpdateItem(item) {
            var modal = {
                title: 'Distribution Center',
                titleHeader: 'Edit Distribution Center',
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

        function joinZones(item) {
            item.zone_name = $filter('filter')(
                DUMMY.zones,
                { id: item.zone_id },
                true
            )[0].name;
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
