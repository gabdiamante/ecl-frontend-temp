import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';

(function() {
    'use strict';

    angular.module('app').component('bins', {
        template: require('./bins.html'),
        controller: BinsCtrl,
        controllerAs: 'vm'
    });

    BinsCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function BinsCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.title = 'Bin';
        vm.titleHeader = vm.title + 's';
        vm.route_name = 'bin';

        vm.TPLS = 'binFormModal';

        vm.deactivated = $stateParams.deactivated == 'true' ? 1 : 0;
        vm.activated = +!vm.deactivated;

        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.loading = false;

        vm.siteId = $state.params.siteId;
        vm.keyword = $state.params.keyword;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true,
            tableSearch: true,
            tableDeactivate: true
        };

        vm.option_table.columnDefs = TABLES.bins.columnDefs;
        vm.option_table.data = [];

        vm.goTo = goTo;
        vm.trClick = trClick;

        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleActivation = handleActivation;
        vm.filterTable      = filterTable;

        init();

        function init() {
            getSites();
            getData();
        }

        function getSites() {
            vm.loadingSites = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    page: '1',
                    limit: '9999999999',
                    is_active: '1'
                },
                hasFile: false,
                route: { 'site': '' },
                cache: false,
                cache_string: vm.route_name
            };
            
            QueryService.query(request)
                .then(
                    function(response) {
                        var sites = response.data.data.items;
                        vm.sites = $filter('orderBy')(angular.copy(sites), ['-type', 'code']);
                        vm.sites.unshift({ code: 'All', name: 'All' });
                        vm.siteId = vm.siteId || vm.sites[0].id;
                        vm.site = $filter('filter')(vm.sites, { id: vm.siteId }, true)[0];
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingSites = false;
                });
        }
        
        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    is_active: vm.activated,
                    site_id: vm.siteId,
                    keyword : vm.keyword
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: false,
                cache_string: vm.route_name
            };

            console.log('bins r', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('bins', response);
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
                    console.log(error);
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
            $state.go('app.vehicle-details', { id: data.id });
        }

        function filterTable(value, key) {
            $state.go($state.current.name, { 
                keyword: vm.keyword,
                siteId: vm.site.id,
                page: '',
                limit: ''
            });
        }
    }
})();
