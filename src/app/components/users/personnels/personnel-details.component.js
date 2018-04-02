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
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PersonnelDetailsCtrl(
        $scope,
        $state,
        $filter,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Personnel Details';
        vm.route_name = 'personnel';

        vm.handleUpdateItem = handleUpdateItem;

        init();

        function init () {
            vm.TPLS = 'personnelFormModal';
            getDetails($stateParams.user_id, $stateParams.site_id);
        }

        function getDetails(hs_id, site_id) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: false,
                hasFile: false,
                route: { site: site_id, [vm.route_name]:hs_id }, 
                cache: false
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.item_details = response.data.data;
                        vm.item_details.fullname = 
                            ((vm.item_details.last_name) ? vm.item_details.last_name + ', ' : '') + 
                            vm.item_details.first_name +' '+ vm.item_details.middle_name;
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
            var modal = { header: 'Update '+vm.title };
            var request = {
                method: 'PUT', 
                body: data,
                params: false,
                hasFile: false,
                route: { site: data.site_id, [vm.route_name]:data.user_id } 
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) 
                        vm.item_details = response;
                        vm.item_details.fullname = 
                            ((vm.item_details.last_name) ? vm.item_details.last_name + ', ' : '') + 
                            vm.item_details.first_name +' '+ vm.item_details.middle_name; 
                },
                function(error) {
                    console.log(error);
                }
            );
        }
    }
})();
