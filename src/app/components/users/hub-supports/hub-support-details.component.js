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
            getDetails($stateParams.user_id, $stateParams.site_id);
        }

        function getDetails(hs_id, site_id) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: false,
                hasFile: false,
                route: { site: site_id, 'hub-support':hs_id }, 
                cache: false
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        console.log(response);
                        vm.data = response.data.data;
                        vm.data.fullname = ((vm.data.last_name) ? vm.data.last_name + ', ' : '') + vm.data.first_name + ' ' + vm.data.middle_name;
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
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
                method: 'PUT', 
                body: data,
                params: false,
                hasFile: false,
                route: { site: data.site_id, 'hub-support':data.user_id },
                cache: false
            };

            ModalService.form_modal(request, modal, 'hubSupportForm').then(
                function(response) {
                    if (response) {
                        vm.data = response; 
                        vm.data.fullname = ((vm.data.last_name) ? vm.data.last_name + ', ' : '') + vm.data.first_name + ' ' + vm.data.middle_name;
                    }
                },
                function(error) {
                    console.log(error);
                }
            );
        }
    }
})();
