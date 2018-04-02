import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message'; 
import CONSTANTS from 'Helpers/constants';


(function() {
    'use strict';

    angular.module('app').component('dispatchers', {
        template: require('./dispatchers.html'),
        controller: DispatchersCtrl,
        controllerAs: 'vm'
    });

    DispatchersCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DispatchersCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm              = this;
        vm.title            = 'Dispatcher';
        vm.titleHeader      = vm.title + 's';
        vm.route_name       = 'dispatcher';

        vm.TPLS             = 'dispatcherFormModal';

        vm.deactivated      = $stateParams.deactivated == 'true' ? 1 : 0;
        vm.activated        = +!vm.deactivated;

        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10'; 
        vm.site_types = CONSTANTS.site_types;
        vm.site_type = $stateParams.site_type || vm.site_types[0].code;
        vm.site_type = $stateParams.site_type || 'HUB';
        vm.site_id = $stateParams.site_id;



        vm.per_page         = ['10', '20', '50', '100', '200'];
        vm.total_page       = '1';
        vm.total_items      = '0';
        vm.loading          = false;

        vm.option_table         = { 
            defaultPagination   : true,
            hideSearchByKey     : true,
            searchTemplate      : true, 
            tableDeactivate     : true
        };

        vm.option_table.columnDefs  = TABLES.dispatchers.columnDefs;
        vm.option_table.data        = [];

        vm.goTo                 = goTo; 
        vm.handlePostItem       = handlePostItem;
        vm.handleUpdateItem     = handleUpdateItem;
        vm.handleActivation     = handleActivation;
        vm.selectSiteFiltered = selectSiteFiltered;
        vm.getData = getData;

        getData();
        getSites();

        function getSites() {
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1',
                    type: vm.site_type,
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: true,
                cache_string: 'sites'
            };

            QueryService
                .query(request)
                .then(
                function (response) {
                    vm.sites = response.data.data.items;
                },
                function (error) {
                    logger.error(error.data.message);
                    //logger.error(MESSAGE.error, err, '');
                }
                );
        }


        function getData(key) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    site_id: vm.site_id,
                    keyword: key,
                    is_active: vm.activated
                },
                hasFile: false,
                route: { [vm.route_name + 's']: '' },
                cache: false,
                cache_string: vm.route_name
            };

            console.log('vehciles', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('dispatcher', response);
                        vm.option_table.data = response.data.data.items;
                        vm.pagination.total = response.data.data.total;
                        vm.pagination.page = $stateParams.page || '1';
                        vm.pagination.limit = $stateParams.limit || '10';
                    },
                    function(error) {
                        logger.error(error.data.message);
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
                    if (!response) return;
                    response.updated = new Date();
                    vm.option_table.data.unshift(response);
                },
                function(error) {
                    logger.error(error.data.message);
                }
            );
        }

        function handleUpdateItem(data) {
            var modal = {
                title: vm.title,
                titleHeader: 'Update ' + vm.title,
                method: 'edit'
            };
            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { site: data.site_id, [vm.route_name]:data.user_id } 
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (!response) return;
                    response.updated = new Date();
                    vm.option_table.data[vm.option_table.data.indexOf(data)] = response; 
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
                prop: data.first_name + ' ' + data.last_name
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

        function selectSiteFiltered(site_type, site_id, zone_id) {
            goTo({ site_type: site_type, site_id: site_id});
        }

        function executeActivateDeactivateDelete(data, action) {
            var request = {
                method: action == 'delete' ? 'DELETE' : 'PUT',
                body: false,
                params: false,
                hasFile: false,
                route: { site: data.site_id, [vm.route_name]: data.user_id }, 
                cache: false
            };
            if (action != 'delete') request.route[action] = '';

            QueryService.query(request).then(
                function(response) {
                    vm.option_table.data.splice(
                        vm.option_table.data.indexOf(
                            $filter('filter')(vm.option_table.data, {
                                 user_id:data.user_id 
                            })[0]
                    ), 1);
                    logger.success(vm.title + ' ' + action + 'd');
                },
                function(error) {
                    logger.errorFormatResponse(error);
                }
            );
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        } 
    }
})();
