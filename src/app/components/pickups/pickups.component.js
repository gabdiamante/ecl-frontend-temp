import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular
        .module('app')
        .component('pickupsBadAddress', {
            template: require('./bad-address/bad-address.html'),
            controller: PickupsCtrl,
            controllerAs: 'vm'
        })
        .component('pickupsStaging', {
            template: require('./staging/staging.html'),
            controller: PickupsCtrl,
            controllerAs: 'vm'
        })
        .component('pickupsDispatched', {
            template: require('./dispatched/dispatched.html'),
            controller: PickupsCtrl,
            controllerAs: 'vm'
        });

        PickupsCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PickupsCtrl(
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.view                 = $stateParams.view || 'bad_address';
        vm.route_name           = 'booking';

        vm.titleHeader          = 'Pickups - ' + ( (vm.view=='bad_adress')?'Bad Address':(vm.view=='staging')?'Staging':(vm.view=='dispatched')?'Dispatched':'Bad Address' );
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
        vm.option_table.columnDefs = TABLES['pickup_'+vm.view].columnDefs;

        vm.dispatched = [
            { firstName:'Gabriel', lastName:'Diamante', assignments:'4' },
            { firstName:'Ruru', lastName:'Magana', assignments:'4' },
            { firstName:'Abel', lastName:'Madrid', assignments:'4' },
            { firstName:'Marvin', lastName:'Zabala', assignments:'4' },
            { firstName:'Christan', lastName:'Tecson', assignments:'4' },
            { firstName:'Lester', lastName:'Dequina', assignments:'4' }
        ];
        
        vm.goTo             = goTo;
        vm.viewMap          = viewMap;
        vm.dispatch         = dispatch;
        
        init();

        function init () {
            getData();
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

        function handleNames(data) {
            for (let i = 0; i < data.length; i++) {
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            }
            return data;
        }

        function goTo(data) { 
            data.view = vm.view; 
            $state.go('app.pickups-'+vm.view, data);
        }

        function viewMap (data, index) {
            data.address = data.shipper_address;
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

        function dispatch(data, index) {
            var reqData = {
                awbIds:null,
                bookingIds : vm.items.checkItems,
                hubId:vm.hub,
            };
            var modal = { titleHeader: "Select Courier" };
            var request = {
                method  : 'PUT',
                body    : reqData,
                params  : {all:true},
                dispatch: true,
                hasFile : false,
                route :  { 'couriers': '' }
                // route   : {express:'', bookings:'', couriers:''},
                // cache_string : ['couriers','vehicles','courier'],
            };
            
            ModalService.form_modal(request, modal, 'courierListFormModal').then(
                function(response) {
                    if (response) {
                        vm.disable = true;
                        removeSelected(vm.data);
                    }
                    // vm.data.splice(index, 1);
                },
                function(error) {
                    console.log(error);
                }
            );
        }

    }
})();
