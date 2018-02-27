import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular
        .module('app')
        .component('deliveriesBadAddress', {
            template: require('./bad-address/bad-address.html'),
            controller: DeliveriesCtrl,
            controllerAs: 'vm'
        })
        .component('deliveriesStaging', {
            template: require('./staging/staging.html'),
            controller: DeliveriesCtrl,
            controllerAs: 'vm'
        })
        .component('deliveriesDispatched', {
            template: require('./dispatched/dispatched.html'),
            controller: DeliveriesCtrl,
            controllerAs: 'vm'
        });

    DeliveriesCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DeliveriesCtrl(
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.view                 = $stateParams.view || 'bad_address';
        vm.titleHeader          = 'Deliveries - ' + ( (vm.view=='bad_adress')?'Bad Address':(vm.view=='staging')?'Staging':(vm.view=='dispatched')?'Dispatched':'Bad Address');
        vm.route_name           = 'booking';
        vm.per_page             = ['10', '20', '50', '100', '200'];
        vm.total_page           = '1';
        vm.total_items          = '0';
        vm.items                = { checkItems: [] };
        vm.loading              = false;
        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';

        vm.option_table = { 
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true 
        };

        vm.option_table.data = [];
        vm.option_table.columnDefs = TABLES['delivery_'+vm.view].columnDefs;

        vm.dispatched = [
            { firstName:'Gabriel', lastName:'Diamante', assignments:'4' },
            { firstName:'Ruru', lastName:'Magana', assignments:'4' },
            { firstName:'Abel', lastName:'Madrid', assignments:'4' },
            { firstName:'Marvin', lastName:'Zabala', assignments:'4' },
            { firstName:'Christan', lastName:'Tecson', assignments:'4' }
        ];
        
        vm.goTo             = goTo;
        vm.viewMap          = viewMap;
        
        init();

        function init () {
            getData();
            getAssignments();
        }

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: { 
                    type: vm.view,
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: false,
            };

            QueryService.query(request).then(
                function(response) {
                    console.log(response);
                    vm.option_table.data = response.data.data.items;
                },
                function(error) {
                    logger.errorFormatResponse(error);
                }
            ).finally(function(){
                vm.loading = false;
            });
        }

        // function getData() {
        //     vm.loading = true;
        //     var request = {
        //         method: 'GET',
        //         body: false,
        //         params: { per_page: 10 },
        //         hasFile: false,
        //         route: { users: '' },
        //         cache: true,
        //         cache_string: 'user'
        //     };

        //     QueryService.query(request).then(
        //         function(response) {
        //             vm.option_table.data = DUMMY.users.deliveries;
        //             // vm.option_table.data = handleNames(response.data.data);
        //         },
        //         function(err) {
        //             logger.error(MESSAGE.error, err, '');
        //         }
        //     ).finally(function(){
        //         vm.loading = false;
        //     });
        // }

        function getAssignments() {
            var request = {
                method: 'GET',
                body: false,
                params: { per_page: 10 },
                hasFile: false,
                route: { users: '' },
                cache: true,
                cache_string: 'user'
            };

            QueryService.query(request).then(
                function(response) {
                    vm.option_table.assignments = DUMMY.users.courier_deliveries;
                    // vm.option_table.data = handleNames(response.data.data);
                },
                function(err) {
                    logger.error(MESSAGE.error, err, '');
                }
            );
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++) {
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            }
            return data;
        }

        function goTo(data) { 
            data.view = vm.view; 
            $state.go('app.deliveries-'+vm.view, data);
        }

        function viewMap (data, index) {
            data.address = data.cneeAddress;
            var request = {
                method  : 'PUT',
                body    : data,
                params  : {},
                hasFile : false,
                route   : { express:'', address:'assignLatlng'},
            }; 
            
            var modal = {
                title   : 'delivery',
                titleHeader: "Update Address",
                
            };
            
            ModalService.form_modal(request, modal, 'geocodeFormModal','lg').then(
                function(response) {
                    // vm.data.splice(index, 1);
                },
                function(error) {
                    console.log(error);
                }
            );
 
        }
    }
})();
