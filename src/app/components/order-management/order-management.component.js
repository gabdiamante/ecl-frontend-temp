import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';
import UTILS from 'Helpers/util';

var moment = require('moment');

;(function (){
    'use strict';

    angular.module('app').component('orderManagement', {
        template: require('./order-management.html'),
        controller: OrderManagementCtrl,
        controllerAs: 'vm'
    });

    angular
        .module('app')
        .controller('OrderManagementCtrl', OrderManagementCtrl);

    OrderManagementCtrl.$inject = [
        '$rootScope',
        '$state',
        '$scope', 
        '$stateParams',
        '$cookies',
        '$cacheFactory', 
        '$timeout',
        'QueryService',
        'ViewService',
        'logger',
        'Upload'
    ];

    function OrderManagementCtrl($rootScope, $state, $scope, $stateParams,$cookies,$cacheFactory, $timeout, QueryService,ViewService,logger, Upload) {
        
        var vm = this;
        vm.titleHeader = 'Order Management';

        vm.user = GLOBAL.user($cookies, $state);
        vm.csv = "";
        vm.action='import';
        vm.item = {};
        vm.duplicates = []; 
        vm.activateBtn = false;
        vm.showDuplicates = false;
        vm.dateFormat = UTILS.dateFormat;
        vm.date = {
            start:moment().format( vm.dateFormat ),
            end:moment().format( vm.dateFormat )
        };
        vm.dateParams = vm.date;

        vm.module = $stateParams.module || 'pickups';

        if (vm.module == 'deliveries') {
            vm.moduleIndex = 1;
            vm.route_name = 'deliveries';
        } else { //pickups or other
            vm.moduleIndex = 0;
            vm.route_name = 'bookings';
        }

        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';

        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.loading = false;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: false,
            tableSearch: false,
            tableDeactivate: false,
            loadingTitle: vm.route_name
        };

        vm.option_table.columnDefs = TABLES.hubs.columnDefs;
        vm.option_table.data = [];

        vm.selectItem = selectItem;
        vm.uploadFile = uploadFile;

        vm.changeModule = changeModule;

        vm.goTo         = goTo;

        init();

        function init() {
            retrieveItems();
        }
         

        function retrieveItems () { 
            vm.loading = true;
        
            var params = { /* must be in alphabetical order */
                limit: vm.pagination.limit,
                page: vm.pagination.pagestate,
            };

            var request = {
                method  : 'GET',
                body    : false,
                params  : params,
                hasFile : false,
                route   : { 'express': vm.route_name, 'import-list': '' },
                cache   : false,
                token   : vm.user.token  ,
                cache_string: [],
            };

            console.log('req', request);

            QueryService
                .query(request)
                .then( function (response) { 
                    console.log('ss',response);

                    vm.option_table.data = response.data.data.items;
                    vm.pagination.total = response.data.data.total;
                    vm.pagination.page = $stateParams.page || '1';
                    vm.pagination.limit = $stateParams.limit || '10';

                    
                }, function (error) { 
                    logger.error(error.data.message);
                })
                .finally(function () {
                    vm.loading = false;
                });
        }
        

        function selectItem (item) {
            vm.item = item;
        }

        function uploadFile (file, key) {

            console.log(key);
            var url = GLOBAL.set_url({
                express:"",
                [vm.route_name]:"",
                import:""
            });

            console.log('uploadurl',url);
            Upload.upload({
                url: url,
                data: {[vm.route_name]: file},
                headers : GLOBAL.header(vm.user.token)
            }).then(function (response) {
                logger.success(response.data.data.message);
                $state.reload();
            }, function (error) {
                if(!error.data.message) {
                     logger.error(error.data.errors[0].message);
                } else {
                    logger.error(error.data.message);
                    vm.errorMsg = error.data.message;
                    vm.duplicates = error.data.duplicates;
                }
                vm.csv="";
            }, function (evt) {
                vm.progress = {};
                vm.progress[key] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }

        function changeModule (module_data) {
            $state.go($state.current.name, {page: '',limit: '' ,module: module_data});
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }
        
    }
})();