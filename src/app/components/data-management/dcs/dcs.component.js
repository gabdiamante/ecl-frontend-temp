import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('dcs', {
        template: require('./dcs.html'),
        controller: DistributionCentersCtrl,
        controllerAs: 'vm'
    });

    DistributionCentersCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DistributionCentersCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.title = 'Distribution Center';
        vm.titleHeader = vm.title + 's';

        vm.TPLS = 'distributionCenterFormModal';
        vm.route_name = 'site';

        vm.deactivated = $stateParams.deactivated == 'true' ? 1 : 0;
        vm.activated = +!vm.deactivated;
        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.loading = false;
        vm.hubId = $state.params.hubId;
        vm.keyword = $state.params.keyword;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true,
            tableSearch: true,
            tableDeactivate: true
        };

        vm.option_table.columnDefs = TABLES.distribution_centers.columnDefs;
        vm.option_table.data = [];

       
        vm.goTo = goTo;
        vm.trClick = trClick;
        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleActivation = handleActivation;
        vm.filterTable    = filterTable;

        init();

        function init() {
            getHubs();
            getData();
        }

        getHubs();

        function getHubs() { 
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999',
                    page: '1',
                    type: 'HUB',
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: false,
                cache_string: 'site'
            }; 

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.hubs = response.data.data.items;
                        vm.hubs.unshift({ id: null, code: 'All', name: 'All' });
                        vm.hubId = vm.hubId || vm.hubs[0].id;
                        vm.hub = $filter('filter')(vm.hubs, { id: vm.hubId }, true)[0];
                    },
                    function(error) {
                       logger.errorFormatResponse(error);
                    }
                );
        }

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    type: 'DC',
                    is_active: vm.activated,
                    keyword: vm.keyword,
                    hub_id: vm.hubId
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: false,
                cache_string: vm.route_name
            };

            console.log(request);
            
            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('dcs', response);
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
                titleHeader: 'Add ' + vm.title,
                method: 'add'
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
                        $state.reload();
                        vm.option_table.data.unshift(response);
                    }
                },
                function(error) {
                    console.log(error);
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
                method: 'PUT',
                body: item,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id }
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        console.log('update res update item', response);
                        $state.reload();
                    }
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function handleActivation(data, action) {
            var content = {
                header: action + ' ' + vm.title,
                message: MESSAGE.confirmMsg(action, vm.title.toLowerCase()),
                prop: data.code
            };

            ModalService.confirm_modal(content).then(
                function(response) {
                    if (!response) return;
                    executeActivateDeactivateDelete(data, action);
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function executeActivateDeactivateDelete(data, action) {
            var request = {
                method: action == 'delete' ? 'DELETE' : 'PUT',
                body: false,
                params: false,
                hasFile: false,
                //route: { [vm.route_name]: data.id },
                route: { [vm.route_name]: data.id },
                cache: false
            };
            if (action != 'delete') request.route[action] = '';

            QueryService.query(request).then(
                function(response) {
                    vm.option_table.data.splice(vm.option_table.data.indexOf(
                        $filter('filter')(vm.option_table.data, {
                            id: data.id
                        })[0]
                    ), 1);
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
            $state.go('app.distribution-center-details', { id: data.id });
        }

        function filterTable(value, key) {
            console.log(vm.hubId);
            $state.go($state.current.name, { 
                keyword: vm.keyword,
                hubId: vm.hub.id,
                page: '',
                limit: ''
            });
        }


    }
})();
