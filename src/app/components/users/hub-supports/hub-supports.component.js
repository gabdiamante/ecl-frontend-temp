import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message'; 
import CONSTANTS from 'Helpers/constants';


(function() {
    'use strict';

    angular.module('app').component('hubSupports', {
        template: require('./hub-supports.html'),
        controller: HubSupportsCtrl,
        controllerAs: 'vm'
    });

    HubSupportsCtrl.$inject = [
        '$scope',
        '$state',
        '$filter',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function HubSupportsCtrl(
        $scope,
        $state,
        $filter,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm                  = this;
        vm.title                = 'Hub Support';
        vm.titleHeader          = vm.title + 's';
        vm.route_name           = 'hub-supports';
        vm.per_page             = ['10', '20', '50', '100', '200']; 
        vm.total_items          = '0';
        vm.params               = angular.copy($stateParams);
        vm.deactivated          = ($stateParams.deactivated == 'true') ? 1 : 0;
        vm.activated            = +!vm.deactivated;
        vm.loading              = false;
        
        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';
        vm.site_types = CONSTANTS.site_types;
        vm.hub = $stateParams.hub_id;

        vm.option_table         = {
            defaultPagination   : true,
            hideSearchByKey     : true,
            searchTemplate      : true,
            tableDeactivate     : true 
        };

        vm.option_table.columnDefs = TABLES.hub_supports.columnDefs;
        vm.option_table.data    = [];

        vm.goTo                 = goTo; 
        vm.handleUpdateItem     = handleUpdateItem; 
        vm.handleHSActivation   = handleHSActivation; 
        vm.createHubSupport = createHubSupport; 
        vm.getHubSupports = getHubSupports; 
        vm.selectSiteFiltered = selectSiteFiltered;

        init();

        function init() {
            getHubSupports();
            getSites();

        }

        getHubs();

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

        function getHubs() { 
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1',
                    type: 'HUB',
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: true,
                cache_string: 'site'
            }; 

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.hubs = handleNames(response.data.data.items); 
                    },
                    function(err) {
                        logger.error(MESSAGE.loggerFailed(vm.title, request.method));
                        console.log(err);
                    }
                );
        }

        function createHubSupport () {
            var modal = { header: 'Create '+vm.title };
            var request = {
                method: 'POST',
                body: {},
                params: {},
                hasFile: false,
                route: { 'hub-support': '' },
                cache: true,
                cache_string: vm.route_name
            };

            ModalService
                .form_modal(request, modal, 'hubSupportForm', 'md', '')
                .then(
                    function(response) { 
                        if (!response) return;
                        response.updated = new Date();
                        vm.option_table.data.unshift(response); 
                        vm.option_table.data = handleNames(vm.option_table.data); 
                    }, 
                    function(error) {
                        console.log(error); 
                    }
                ); 
        }

        function getHubSupports(key) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    site_id: vm.hub,
                    keyword: key,
                    is_active: vm.activated
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                // cache: true, temporarily removed
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.option_table.data    = handleNames(response.data.data.items); 
                        vm.pagination.page      = $stateParams.page || '1';
                        vm.pagination.limit     = $stateParams.limit || '10'; 
                        vm.pagination.total     = response.data.data.total;
                    },
                    function(err) {
                        logger.error(MESSAGE.loggerFailed(vm.title, request.method));
                        console.log(err);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem(data) {
            var modal = { header: 'Update ' + vm.title };
            var request = {
                method: 'PUT', 
                body: data,
                params: false,
                hasFile: false,
                route: { site: data.site_id, 'hub-support':data.user_id },
                cache: false
            };

            ModalService
                .form_modal(request, modal, 'hubSupportForm')
                .then(
                    function(response) { 
                        if (!response) return;
                        response.updated = new Date();
                        vm.option_table.data[
                            vm.option_table.data.indexOf(data)
                        ] = response;
                        vm.option_table.data = handleNames(
                            angular.copy(vm.option_table.data)
                        ); 
                    },
                    function(error) { 
                        logger.error(
                            error.data.message || catchError(request.route)
                        );
                    }
                );
        }

        function handleHSActivation (data, action) {
            var content = {
                header: action+' '+vm.title,
                message: MESSAGE.confirmMsg(action, vm.title.toLowerCase()),
                prop: data.first_name+' '+(data.middle_name+' '||'')+data.last_name
            };

            ModalService
                .confirm_modal(content)
                .then(
                    function (response) {
                        if (!response) return; 
                        activateDeactivateDeleteHs(data, action);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
        }

        function activateDeactivateDeleteHs (data, action) {
            var request = {
                method: action == 'delete' ? 'DELETE' : 'PUT',
                body: {},
                params: false,
                hasFile: false,
                route: { site:data.site_id, 'hub-support':data.user_id } 
            };
            if (action != 'delete') request.route[action] = '';

            QueryService
                .query(request)
                .then( 
                    function (response) { 
                        logger.success(MESSAGE.loggerSuccess(vm.title, '', action+'d'));
                        vm.option_table.data.splice(
                            vm.option_table.data.indexOf(
                                $filter('filter')(vm.option_table.data, {
                                     user_id:data.user_id 
                                })[0]
                        ), 1);
                    },
                    function (err) {
                        logger.error(MESSAGE.loggerFailed(vm.title, '', action));
                        console.log(err);
                    }
                );
        } 

        function selectSiteFiltered(hub_id) {
            goTo({ hub_id: hub_id});
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname =
                    data[i].first_name +
                    ' ' +
                    (data[i].middle_name + ' ' || '') +
                    data[i].last_name;
            return data;
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }
    }
})();
