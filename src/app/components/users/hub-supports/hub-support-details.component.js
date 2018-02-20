import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('hubSupportDetails', {
        template: require('./hub-support-details.html'),
        controller: HubSupportDetailsCtrl,
        controllerAs: 'vm'
    });

    HubSupportDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function HubSupportDetailsCtrl(
        $scope,
        $state,
        $filter,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Hub Support Details';
        vm.route_name = 'hub-support';

        vm.handleUpdateItem = handleUpdateItem;

        init();

        function init() {
            getDetails($stateParams.id);
        }

        function getDetails(hs_id) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: false,
                hasFile: false,
                route: { users: '' },
                cache: false
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.data = $filter('filter')(DUMMY.users.hub_supports, {
                            id: hs_id
                        })[0];
                    },
                    function(err) {
                        vm.data = {};
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(data) {
            var modal = { header: 'Update Hub Support' };
            var request = {
                method: 'GET', // PUT
                body: data,
                params: false,
                hasFile: false,
                route: { users: '' },
                cache: false
            };

            ModalService.form_modal(request, modal, 'hubSupportForm').then(
                function(response) {
                    if (response) {
                        console.log(response);
                        vm.data = response;
                    }
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }
    }
})();
