import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';

(function() {
    'use strict';

    angular.module('app').component('couriers', {
        template: require('./couriers.html'),
        controller: CouriersCtrl,
        controllerAs: 'vm'
    });

    CouriersCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function CouriersCtrl(
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Couriers';

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
            tableSearch: true
        };

        vm.option_table.columnDefs = TABLES.couriers.columnDefs;
        vm.option_table.data = [];

        vm.goTo = goTo;
        vm.trClick = trClick;

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
                cache: true,
                cache_string: 'user'
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.option_table.data = [
                            {
                                id: 1,
                                name: 'Abel Madrid',
                                contact: '09879733958',
                                zone: 'zone-001',
                                vehicle: 'ABE 999',
                                updatedAt: new Date()
                            },
                            {
                                id: 2,
                                name: 'Ruru Magana',
                                contact: '09567458568',
                                zone: 'zone-002',
                                vehicle: 'BEL 999',
                                updatedAt: new Date()
                            },
                            {
                                id: 3,
                                name: 'Lester Dequina',
                                contact: '09456847884',
                                zone: 'zone-003',
                                vehicle: 'TER 783',
                                updatedAt: new Date()
                            },
                            {
                                id: 4,
                                name: 'Marvin Zabala',
                                contact: '09568457933',
                                zone: 'zone-004',
                                vehicle: 'ABE 474',
                                updatedAt: new Date()
                            },
                            {
                                id: 5,
                                name: 'Christasn Tecson',
                                contact: '09872927553',
                                zone: 'zone-005',
                                vehicle: 'ABE 463',
                                updatedAt: new Date()
                            },
                            {
                                id: 6,
                                name: 'Gabriel Diamante',
                                contact: '09327692734',
                                zone: 'zone-006',
                                vehicle: 'ABE 087',
                                updatedAt: new Date()
                            }
                        ];
                        // vm.option_table.data    = handleNames(response.data.data);
                        // vm.pagination.page      = $stateParams.page || '1';
                        // vm.pagination.limit     = $stateParams.limit || '10';
                        // vm.total_page           = response.data.total_pages;
                        // vm.total_items          = response.data.total;
                    },
                    function(err) {
                        logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            return data;
        }

        function goTo(data) {
            $state.go('app.couriers', data);
        }

        function trClick(data) {
            $state.go('app.courier-details', { id: data.id });
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
    }
})();
