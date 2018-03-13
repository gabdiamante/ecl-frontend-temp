import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import UTILS from 'Helpers/util';

;(function (){
    'use strict';

    angular.module('app').component('orderManagementDetails', {
        template: require('./order-management-details.html'),
        controller: OrderManagementDetailsCtrl,
        controllerAs: 'vm'
    });

    angular
        .module('app')
        .controller('OrderManagementDetailsCtrl', OrderManagementDetailsCtrl);

    OrderManagementDetailsCtrl.$inject = ['$rootScope', '$cookies','$state', '$scope', '$stateParams', '$filter' ,'QueryService','ModalService','logger'];

    function OrderManagementDetailsCtrl ($rootScope,$cookies, $state, $scope, $stateParams, $filter,  QueryService,ModalService,logger) {
        
        var vm = this;

        vm.id = $state.params.id;
        vm.module = $stateParams.module || 'pickups';
        
        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: false,
            tableSearch: false,
            tableDeactivate: false,
            
        };

        TABLES.order_management = TABLES.order_management || { deliveries: {}, pickups: {} };
        if (vm.module == 'deliveries') {
            vm.moduleName = 'Delivery';
            vm.route_name = 'deliveries';
            vm.option_table.columnDefs = TABLES.order_management.deliveries.columnDefs;

        } else { //pickups or other
            vm.moduleName = 'Booking';
            vm.route_name = 'bookings';
            vm.option_table.columnDefs = TABLES.order_management.pickups.columnDefs;
        }

        vm.option_table.loadingTitle = vm.route_name;

        vm.option_table.data = [];
        
        init();

        function init() {
            getData();
        } //init

        function getData (key) {
            vm.isLoading = true;

            var req =  { 
                method  : 'GET', 
                body    : false,
                params  : false, 
                hasFile : false, 
                cache   : false,
                route   : { 'express': vm.route_name, 'import-list': vm.id },
                ignoreLoadingBar:true,
                cache_string:[]
            };

            //vm.data  =  $filter('filter')(angular.copy(DUMMY.order_booking), { id: vm.id }, true )[0];
            QueryService
                .query(req)
                .then(function (response) { 
                    console.log('det', response);
                    vm.option_table.data = response.data.data.items;
                    vm.pagination.total = response.data.data.total;
                    vm.pagination.page = $stateParams.page || '1';
                    vm.pagination.limit = $stateParams.limit || '10';
                }, function (error) { 
                    console.log(error);
                    vm.isLoading = false;
                });
        }


    }
})();