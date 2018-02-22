import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import CONSTANTS from 'Helpers/constants';

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
        var vm = this;

        // methods
        vm.save = save;
        vm.cancel = cancel;
        vm.passwordValidError = passwordValidError;

        vm.changeSiteType = changeSiteType;

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            vm.site_type = angular.copy(vm.data.site_type);
            vm.storeData = [];

            getSiteTypes();

            getSites();
            //console.log(Modal);
        };

        function getSiteTypes() {
            vm.site_types = CONSTANTS.site_types;
            vm.site_type = vm.site_type || vm.site_types[0].code;
        }

        function getSites() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1,
                    type: vm.site_type
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            };

            console.log('sites r', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.sites = response.data.data.items;
                        vm.sites.unshift({ code: 'Select Sites' });
                        vm.data.site_id = vm.data.site_id || vm.sites[0].id;
                        // vm.total_items          = response.data.data.total;
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            vm.Request.body = vm.data;
            // vm.Request.body.role = 'DISPATCHER';

            if (vm.Modal.method == 'add') {
                console.log(vm.Modal.method);
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.details || {};
                            logger.success(vm.Modal.title + ' added.');
                            close(response_data, action);
                        },
                        function(error) {
                            console.log(error);
                            logger.error(
                                error.data.errors[0].message,
                                {},
                                error.data.errors[0].code
                            );
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            } else if (vm.Modal.method == 'edit') {
                vm.Request.route = {
                    site: vm.data.site_id,
                    [vm.Modal.route_name]: vm.data.user_id
                };

                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            console.log('edit dis', response);
                            var response_data =
                                response.data.data.details || {};

                            logger.success(vm.Modal.title + ' updated.');
                            close(vm.Request.body, action);
                        },
                        function(error) {
                            logger.error(
                                error.data.errors[0].message,
                                {},
                                error.data.errors[0].code
                            );
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            }
        }

        function changeSiteType(item) {
            // vm.data.site_id = null;
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
