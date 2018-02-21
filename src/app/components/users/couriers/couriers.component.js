import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';
import CONSTANTS from 'Helpers/constants';

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
        '$filter',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function CouriersCtrl(
        $scope,
        $state,
        $filter,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm                  = this;
        vm.title                = 'Courier';
        vm.titleHeader          = vm.title+'s';
        vm.route_name           = 'couriers';
        vm.per_page             = ['10', '20', '50', '100', '200']; 
        vm.total_items          = '0';
        vm.items                = { roleUserCheck: [] };
        vm.params               = angular.copy($stateParams);
        vm.deactivated          = ($stateParams.deactivated == 'true') ? 1 : 0;
        vm.activated            = +!vm.deactivated;
        vm.site_types           = CONSTANTS.site_types;
        vm.site_type            = $stateParams.site_type || vm.site_types[0].code;
        vm.loading              = false;

        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';

        vm.option_table         = { 
            defaultPagination   : true, 
            hideSearchByKey     : true, 
            searchTemplate      : true, 
            tableDeactivate     : true 
        };

        vm.option_table.columnDefs  = TABLES.couriers.columnDefs;
        vm.option_table.data        = [];
        vm.sites                    = [];
        vm.zones                    = [];

        vm.goTo                 = goTo; 
        vm.changeListView       = changeListView; 
        vm.handleHSActivation   = handleHSActivation; 
        vm.createCourier        = createCourier;
        vm.updateCourier        = updateCourier;
        vm.selectSiteType       = selectSiteType;

        init ();

        function init () {
            getCouriers();  
            getSites(vm.site_type);
            getZones();
        }

        function getSites (site_type) {
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1',
                    type: site_type,
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
                    function(response) { 
                        vm.sites = response.data.data.items; 
                    },
                    function(error) {
                        logger.error(error.data.message);
                        //logger.error(MESSAGE.error, err, '');
                    }
                );
        }
        
        function getZones (key, update_view_center_latlng) { 
            var request = {
                method: 'GET',
                body: false, 
                params: { page: 1, limit: 999999 },
                hasFile: false,
                route: { zone: '' },
                cache: true,
                cache_string: 'zone'
            };
            
            QueryService
                .query(request)
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
        
        function createCourier () {
            var modal = { header: 'Create '+vm.title };
            var request = {
                method: 'POST',
                body: {},
                params: {},
                hasFile: false,
                route: { courier: '' },
                cache: true,
                cache_string: vm.route_name
            };

            ModalService
                .form_modal(request, modal, 'courierForm', 'md', '')
                .then(function(response) { 
                    if (!response) return;
                    vm.option_table.data.unshift(response); 
                    vm.option_table.data = handleNames(vm.option_table.data);
                }, function(error) {
                    console.log(error); 
                }); 
        }

        function getCouriers () {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    is_active:vm.activated
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                // cache: true, will be implemented later
                cache_string: vm.route_name
            };

            QueryService
                .query(request)
                .then(
                    function(response) { 
                        vm.option_table.data = handleNames(response.data.data.items); 
                        vm.pagination.total  = response.data.data.total;
                        vm.pagination.page   = $stateParams.page || '1';
                        vm.pagination.limit  = $stateParams.limit || '10';
                    },
                    function(err) {
                        logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function updateCourier (data) {
            var modal = { header: 'Update '+vm.title };
            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { site:data.site_id, courier:data.user_id },
                cache_string: 'user'
            };
            
            ModalService
                .form_modal(request, modal, 'courierForm', 'md', '')
                .then(function(response) { 
                    if (!response) return;
                    vm.option_table.data[vm.option_table.data.indexOf(data)] = response; 
                    vm.option_table.data = handleNames(vm.option_table.data);
                }, function(error) {
                    console.log(error);
                    // logger.error(error.data.message);
                });
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
                        activateDeactivateCourier(data, action);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
        }

        function activateDeactivateCourier (data, action) {
            var request = {
                method: 'PUT',
                body: {},
                params: false,
                hasFile: false,
                route: { site:data.site_id, courier:data.user_id, [action]:'' } 
            };

            QueryService
                .query(request)
                .then( 
                    function (response) { 
                        logger.success(MESSAGE.loggerSuccess('Courier', '', 'deactivated'));
                        vm.option_table.data.splice(
                            vm.option_table.data.indexOf(
                                $filter('filter')(vm.option_table.data, { user_id:data.user_id })[0]
                            ), 1);
                    },
                    function (err) {
                        logger.error(MESSAGE.loggerFailed('Courier', '', 'deactivate'));
                        console.log(err);
                    }
                );
        } 

        function changeListView (status) { 
            $state.go($state.current.name, {
                page: '1',
                limit: '10',
                deactivated: status
            });
        }

        function selectSiteType (site_type) {
            getSites(site_type);
        }

        function handleNames (data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name+' '+((data[i].middle_name+' ')||'')+data[i].last_name;
            return data;
        }

        function goTo (data) {
            $state.go($state.current.name, data);
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
