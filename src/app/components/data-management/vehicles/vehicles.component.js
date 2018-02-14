import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';

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
        vm.view = 'vehicle';

        vm.TPLS = 'vehicleFormModal';

        vm.deleted = $stateParams.deleted;
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

        vm.changeSize = changeSize;
        vm.changeListView = changeListView;

        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleDeactivateItem = handleDeactivateItem;

        getData();

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    per_page: vm.pagination.limit,
                    page: vm.pagination.pagestate
                },
                hasFile: false,
                route: { users: '' },
                cache: false
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.option_table.data = DUMMY.vehicles;
                        // vm.option_table.data    = handleNames(response.data.data);
                        // vm.pagination.page      = $stateParams.page || '1';
                        // vm.pagination.limit     = $stateParams.limit || '10';
                        // vm.total_page           = response.data.total_pages;
                        // vm.total_items          = response.data.total;
                    },
                    function(err) {
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handlePostItem() {
            var modal = {
                title: vm.title,
                titleHeader: 'Add ' + vm.title,
                method: 'add'
            };

            var request = {
                method: 'GET',
                body: {},
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
                        response.updated = new Date();
                        vm.option_table.data.unshift(response);
                    }
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }

        function handleUpdateItem(item) {
            var modal = {
                title: vm.title,
                titleHeader: 'Edit ' + vm.title,
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
                        vm.option_table.data[
                            vm.option_table.data.indexOf(item)
                        ] = response;
                    }
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }

        function handleDeactivateItem(item) {
            var request = {
                method: 'DELETE',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id },
                cache_string: vm.route_name
            };

            var content = {
                header: 'Remove ' + vm.title,
                message:
                    'Are you sure you want to remove ' +
                    vm.title.toLowerCase() +
                    ' ',
                prop: item.first_name + ' ' + item.last_name
            };

            confirmation(content).then(function(response) {
                if (response) {
                    QueryService.query(request).then(
                        function(response) {
                            vm.option_table.data.splice(
                                vm.option_table.data.indexOf(item),
                                1
                            );
                            logger.success(vm.title + ' removed!');
                        },
                        function(error) {
                            logger.error(
                                error.data.message || catchError(request.route)
                            );
                        }
                    );
                }
            });
        }

        function changeSize(size) {
            $state.go($state.current.name, { page: 1, size: size });
        }

        function changeListView(status) {
            $state.go($state.current.name, {
                page: 1,
                size: $stateParams.size,
                deleted: status
            });
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            return data;
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }

        function trClick(data) {
            $state.go('app.vehicle-details', { id: data.id });
        }

        vm.toggleCheckRoleUserAll = (checkbox, model_name, propertyName) => {
            // var values_of_id = _.pluck(vm.option_table.data, propertyName);
            if (checkbox)
                GLOBAL.getModel(
                    vm.items,
                    model_name,
                    angular.copy(vm.option_table.data)
                );
            else GLOBAL.getModel(vm.items, model_name, []);
        };

        function formModal(request, modal, template, size) {
            return ModalService.form_modal(request, modal, template, size);
        }

        function confirmation(content) {
            return ModalService.confirm_modal(content);
        }
    }
})();
