import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import CONSTANTS from 'Helpers/constants';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('dispatcherFormModal', {
        template: require('./dispatcher-form.html'),
        controller: DispatcherFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    DispatcherFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function DispatcherFormModalCtrl(
        $rootScope,
        $state,
        $cookies,
        $scope,
        $stateParams,
        $filter,
        QueryService,
        logger
    ) {
        var vm      = this; 
        vm.save     = save;
        vm.cancel   = cancel;
        var Modal   = null;
        var Request = null;

        vm.passwordValidError   = passwordValidError;
        vm.changeSiteType       = changeSiteType;

        vm.$onInit = function() {
            Modal           = vm.resolve.Modal;
            Request         = vm.resolve.Request;
            vm.titleHeader  = Modal.titleHeader;
            vm.data         = angular.copy(Request.body) || {};
            vm.method       = angular.copy(Request.method);
            vm.storeData    = [];

            getSiteTypes();
            getSites(); 
        };

        function getSiteTypes() {
            vm.site_types = CONSTANTS.site_types;
            vm.site_type = vm.data.site_type || vm.site_types[0].code;
        }

        function getSites() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1',
                    is_active: 1,
                    type: vm.site_type
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            }; 

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.sites = response.data.data.items;
                        vm.sites.unshift({ code: 'Select Sites' });
                        vm.data.site_id = vm.data.site_id || vm.sites[0].id; 
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function save(data) {
            vm.disable = true;
            Request.body = angular.copy(data); 
            // if (Request.method=='PUT') Request.route.site = data.site_id;
            QueryService
                .query(Request)
                .then(
                    function(response) { 
                        logger.success(MESSAGE.loggerSuccess('Dispatcher', Request.method));
                        vm.modalInstance.close(data);
                    },
                    function(err) {
                        console.log(err);
                        logger.error(MESSAGE.loggerFailed('Dispatcher', Request.method));
                    }
                )
                .finally(function() {
                    vm.loading = false;
                    vm.disable = false;
                });
        }

        function changeSiteType(item) { 
            getSites();
        }

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }

        //validation function
        function passwordValidError(nameForm) {
            return (
                nameForm.password.$viewValue !==
                nameForm.confirm_password.$viewValue
            );
        }
    }
})();
