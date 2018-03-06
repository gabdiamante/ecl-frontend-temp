import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

;(function (){
    'use strict';

    angular.module('app').component('accountDetails', {
        template: require('./account-details.html'),
        controller: AccountDetailsCtrl,
        controllerAs: 'vm'
    });

 
    AccountDetailsCtrl.$inject = ['$rootScope', '$cookies','$state', '$scope', '$stateParams','$filter','QueryService','ModalService','logger'];

    function AccountDetailsCtrl ($rootScope,$cookies, $state, $scope, $stateParams, $filter, QueryService,ModalService,logger) {
        
        var vm = this;
        vm.route_name = 'account';
        vm.title = 'Account';
        vm.titleHeader = vm.title + ' Details';

        vm.handleUpdateItem = handleUpdateItem;

        vm.$onInit = function() {
            vm.TPLS = 'accountFormModal';
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
                        console.log('account details', response);

                        // console.log(DUMMY.accounts);
                        // vm.item_details = $filter('filter')(angular.copy(DUMMY.accounts), { id : $state.params.id })[0];
                        // console.log(vm.item_details);

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
                    logger.errorFormatResponse(error);
                }
            );
        }

    }
})();