import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';

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
        var vm                  = this;
        vm.titleHeader          = 'Couriers';
        vm.route_name           = 'couriers';
        vm.per_page             = ['10', '20', '50', '100', '200'];
        vm.total_page           = '1';
        vm.total_items          = '0';
        vm.items                = { roleUserCheck: [] };
        vm.deactivated          = ($stateParams.deactivated == 'true') ? 1 : 0;
        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';
        vm.loading              = false; 

        vm.option_table         = { 
            defaultPagination   : true,
            hideSearchByKey     : true,
            searchTemplate      : true, 
            tableDeactivate     : true
        };

        vm.option_table.columnDefs  = TABLES.couriers.columnDefs;
        vm.option_table.data    = [];
        vm.hubs                 = [];
        vm.zones                = [];

        vm.goTo                 = goTo; 
        vm.changeListView       = changeListView;   

        init();

        function init () {
            getCouriers();  
            getHubs();
            getZones();
        }

        function getHubs() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '999999',
                    page: '1',
                    type: 'HUB',
                    is_active: 1
                },
                hasFile: false,
                route: { 'site': '' },
                cache: true,
                cache_string: 'site'
            }; 

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.hubs = response.data.data.items; 
                    },
                    function(err) { 
                        console.log(err);
                    }
                );
        }

        function getZones(key, update_view_center_latlng) { 
            var request = {
                method: 'GET',
                body: false, 
                params: { page: 1, limit: 999999 },
                hasFile: false,
                route: { zone: '' },
                cache: true,
                cache_string: 'zone'
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.zones = response.data.data.items || [];  
                    },
                    function(error) {
                        logger.log(
                            error.data.errors[0].context,
                            error,
                            error.data.errors[0].message
                        );
                    }
                );
        }

        function getCouriers() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    per_page: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    is_active:vm.deactivated
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: true,
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        console.log(response);
                        vm.option_table.data = handleNames(response.data.data.items);

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

        function changeListView (status) { 
            console.log(status);
            $state.go($state.current.name, {
                page: '1',
                limit: '10',
                deactivated: status
            });
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name+' '+((data[i].middle_name+' ')||'')+data[i].last_name;
            return data;
        }

        function goTo(data) {
            $state.go('app.couriers', data);
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
