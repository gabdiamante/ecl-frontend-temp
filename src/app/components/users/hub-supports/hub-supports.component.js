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
        var vm = this;
        vm.titleHeader  = 'Hub Supports';
        vm.route_name   = 'hub-support';
        vm.per_page     = ['10', '20', '50', '100', '200'];
        vm.total_page   = '1';
        vm.total_items  = '0';
        vm.items        = { roleUserCheck: [] };
        vm.loading      = false;

        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';

        vm.option_table = { 
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true 
        };

        vm.option_table.columnDefs = TABLES.hub_supports.columnDefs;
        vm.option_table.data = [];

        vm.goTo             = goTo; 
        vm.handleUpdateItem = handleUpdateItem;

        init();

        function init () {
            getHubSupports();
        }

        function getHubSupports() {
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
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.option_table.data = handleNames(DUMMY.users.hub_supports);

                        // vm.option_table.data    = handleNames(response.data.data);
                        // vm.pagination.page      = $stateParams.page || '1';
                        // vm.pagination.limit     = $stateParams.limit || '10';
                        // vm.total_page           = response.data.total_pages;
                        // vm.total_items          = response.data.total;
                    },
                    function(err) {
                        console.log(err); 
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handleUpdateItem (data) {
            var modal = { header: 'Update Hub Support' };
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
                            vm.option_table.data[vm.option_table.data.indexOf(data)] = response;
                            vm.option_table.data = handleNames(angular.copy(vm.option_table.data));
                        }
                    },
                    function(error) {
                        logger.error(error.data.message || catchError(request.route));
                    }
                );
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name + ' ' + ((data[i].middle_name+' ') || '') + data[i].last_name;
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
