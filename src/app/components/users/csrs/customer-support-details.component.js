import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('customerSupportDetails', {
        template: require('./customer-support-details.html'),
        controller: CustomerSupportDetailsCtrl,
        controllerAs: 'vm'
    });

    CustomerSupportDetailsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function CustomerSupportDetailsCtrl(
        $scope,
        $state,
        $filter,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm              = this;
        vm.titleHeader      = 'Customer Support Details';
        vm.route_name       = 'csr';

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
                route: { site: site_id, csr:hs_id }, 
                cache: false
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.data = response.data.data;
                        vm.data.fullname = ((vm.data.last_name) ? vm.data.last_name + ', ' : '') + vm.data.first_name + ' ' + vm.data.middle_name;
                    },
                    function(err) {
                        console.log(err);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(data) {
            var modal = { header: 'Update Customer Support' };
            var request = {
                method: 'PUT', 
                body: data,
                params: false,
                hasFile: false,
                route: { site: data.site_id, 'csr':data.user_id },
                cache: false
            };

            ModalService.form_modal(request, modal, 'customerSupportForm').then(
                function(response) {
                    if (response) 
                        vm.data = response;
                        vm.data.fullname = ((vm.data.last_name) ? vm.data.last_name + ', ' : '') + vm.data.first_name + ' ' + vm.data.middle_name; 
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
