import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';

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

        vm.option_table         = {
            defaultPagination   : true,
            hideSearchByKey     : true,
            searchTemplate      : true
        };

        vm.option_table.columnDefs = TABLES.hub_supports.columnDefs;
        vm.option_table.data    = [];

        vm.goTo                 = goTo; 
        vm.handleUpdateItem     = handleUpdateItem; 
        vm.handleHSActivation   = handleHSActivation; 
        vm.createHubSupport     = createHubSupport;

        init();

        function init() {
            getHubSupports();
        }

        getHubs();

        function getHubs() {
            vm.loading = true;
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
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
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
                .then(function(response) { 
                    if (response) {
                        vm.option_table.data.unshift(response); 
                        vm.option_table.data = handleNames(vm.option_table.data);
                    }
                }, function(error) {
                    console.log(error); 
                }); 
        }

        function getHubSupports() {
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
                cache: true,
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
                method: 'GET', // PUT
                body: data,
                params: false,
                hasFile: false,
                route: { users: '' },
                cache: false
            };

            ModalService
                .form_modal(request, modal, 'hubSupportForm')
                .then(
                    function(response) {
                        if (response) {
                            vm.option_table.data[
                                vm.option_table.data.indexOf(data)
                            ] = response;
                            vm.option_table.data = handleNames(
                                angular.copy(vm.option_table.data)
                            );
                        }
                    },
                    function(error) {
                        logger.error(
                            error.data.message || catchError(request.route)
                        );
                    }
                );
        }

        function handleHSActivation(data, action) {
            // var request = {
            //     method: 'PUT',
            //     body: false,
            //     params: false,
            //     hasFile: false,
            //     route: { [vm.route_name]: item.id, deactivate: '' },
            //     cache: false
            // };

            var content = {
                header: action + ' ' + vm.title,
                message: MESSAGE.confirmMsg(action, vm.title),
                prop: data.first_name + ' ' + data.last_name
            };

            ModalService.confirm_modal(content).then(
                function(response) {
                    if (!response) return;
                    data.status =
                        (action == 'reactivate') ? 'active' : 
                        (action == 'deactivate') ? 'deactivated' : 'deactivated';
                    vm.option_table.data.splice(
                        vm.option_table.data.indexOf(
                            $filter('filter')(vm.option_table.data, {
                                id: data.id
                            })[0]
                        ),
                        1
                    );
                },
                function(err) {
                    console.log(err);
                }
            );
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
            $state.go('app.hub-supports', data);
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
