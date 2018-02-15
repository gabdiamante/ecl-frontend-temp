import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('personnelFormModal', {
        template: require('./personnel-form.html'),
        controller: PersonnelFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    PersonnelFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function PersonnelFormModalCtrl(
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

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            vm.storeData = [];

            getSites();
            //console.log(Modal);
        };

        function getSites() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1
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

            if (vm.Modal.method == 'add') {
                console.log(vm.Modal.method);
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.items[0] || {};
                            logger.success(vm.Modal.title + ' added.');
                            close(response_data, action);
                        },
                        function(error) {
                            logger.error(error.data.message);
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            } else if (vm.Modal.method == 'edit') {
                console.log(vm.Request);

                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.items[0] || {};
                            logger.success(vm.Modal.title + ' updated.');
                            close(response_data, action);
                        },
                        function(err) {
                            logger.error(error.data.message);
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            }
        }

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }
    }
})();
