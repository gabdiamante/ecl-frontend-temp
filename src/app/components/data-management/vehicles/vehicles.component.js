import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('vehicles', {
        template: require('./vehicles.html'),
        controller: VehiclesCtrl,
        controllerAs: 'vm'
    });

    VehiclesCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function VehiclesCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.title = 'Vehicle';
        vm.titleHeader = vm.title + 's';
        vm.route_name = 'vehicle';

        vm.TPLS = 'vehicleFormModal';

        vm.deactivated = $stateParams.deactivated == 'true' ? 1 : 0;
        vm.activated = +!vm.deactivated;

        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.items = { roleUserCheck: [] };
        vm.loading = false;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true,
            tableSearch: true,
            tableDeactivate: true
        };

        vm.option_table.columnDefs = TABLES.vehicles.columnDefs;
        vm.option_table.data = [];

        vm.goTo = goTo;
        vm.trClick = trClick;

        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleHSActivation = handleHSActivation;

        getData();

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    is_active: vm.activated
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: false,
                cache_string: vm.route_name
            };

            console.log('vehciles r', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('vehicles', response);
                        vm.option_table.data = response.data.data.items;
                        vm.pagination.total = response.data.data.total;
                        vm.pagination.page = $stateParams.page || '1';
                        vm.pagination.limit = $stateParams.limit || '10';
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handlePostItem() {
            var modal = {
                title: vm.title,
                titleHeader: 'Add ' + vm.title
            };

            var request = {
                method: 'POST',
                body: {},
                params: false,
                hasFile: false,
                route: { [vm.route_name]: '' }
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        response.updatedAt = new Date();
                        vm.option_table.data.unshift(response);
                    }
                },
                function(error) {
                    logger.errorFormatResponse(error);
                }
            );
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
                route: { [vm.route_name]: item.id }
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        console.log(response);
                        vm.option_table.data[
                            vm.option_table.data.indexOf(item)
                        ] = response;
                    }
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function handleHSActivation(data, action) {
            var content = {
                header: action + ' ' + vm.title,
                message: MESSAGE.confirmMsg(action, vm.title.toLowerCase()),
                prop: data.plate_number
            };

            ModalService.confirm_modal(content).then(
                function(response) {
                    if (!response) return;
                    executeActivateDeactivate(data, action);
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function executeActivateDeactivate(data, action) {
            var request = {
                method: 'PUT',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: data.id, [action]: '' },
                cache: false
            };

            QueryService.query(request).then(
                function(response) {
                    vm.option_table.data.splice(
                        vm.option_table.data.indexOf(
                            $filter('filter')(vm.option_table.data, {
                                id: data.id
                            })[0]
                        ),
                        1
                    );
                    logger.success(vm.title + ' ' + action + 'd!');
                },
                function(err) {
                    console.log(err);
                }
            );
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }

        function trClick(data) {
            $state.go('app.vehicle-details', { id: data.id });
        }
    }
})();
