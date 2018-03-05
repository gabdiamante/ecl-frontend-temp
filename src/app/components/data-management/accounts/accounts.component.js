import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';


;(function (){
    'use strict';

    angular.module('app').component('accounts', {
        template: require('./accounts.html'),
        controller: AccountsCtrl,
        controllerAs: 'vm'
    });

    AccountsCtrl.$inject = ['$rootScope', '$cookies','$state', '$scope', '$stateParams','$filter','$localStorage','QueryService','ModalService','logger'];

    function AccountsCtrl ($rootScope,$cookies, $state, $scope, $stateParams, $filter, $localStorage, QueryService,ModalService,logger) {
        
        var vm = this;
        vm.title = 'Account';
        vm.titleHeader = vm.title + 's';

        vm.TPLS = 'accountFormModal';
        vm.route_name = 'site';

        vm.deactivated = $stateParams.deactivated == 'true' ? 1 : 0;
        vm.activated = +!vm.deactivated;
        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.loading = false;
        vm.keyword = $state.params.keyword;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true,
            tableSearch: true,
            tableDeactivate: true
        };

        vm.option_table.columnDefs = TABLES.accounts.columnDefs;
        vm.option_table.data = [];

        vm.goTo = goTo;
        vm.trClick = trClick;

        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleActivation = handleActivation;
        vm.filterTable    = filterTable;


        init();

        function init() {
            getData();
        } //init

        vm.minRangeSlider = {
            minValue: 8,
            maxValue: 17,
            options: {
                floor: 0,
                ceil: 24,
                step: 0.1
            }
        };

        function getData (key) {
            vm.isLoading = true;

            var req =  { 
                method  : 'GET', 
                body    : false,
                params  : {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    is_active: vm.activated,
                    keyword: vm.keyword
                }, 
                hasFile : false, 
                cache   : false,
                route   : {[vm.route_name]: ''},
                ignoreLoadingBar:true,
            };

            QueryService
                .query(req)
                .then(function (response) { 

                    //console.log('accounts', response);
                    vm.option_table.data = DUMMY.accounts;

                    //vm.option_table.data = response.data.data.items;
                    // vm.pagination.total = response.data.data.total;
                    // vm.pagination.page = $stateParams.page || '1';
                    // vm.pagination.limit = $stateParams.limit || '10';
                    
                }, function (error) { 
                    vm.data=[];
                    logger.errorFormatResponse(error);
                }).finally(function(){
                    vm.isLoading = false;
                });
        }


        function handlePostItem() {
            var modal = {
                title: vm.title,
                titleHeader: 'Add ' + vm.title
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
                    if (response) {
                        response.updated = new Date();
                        vm.option_table.data.unshift(response);
                    }
                },
                function(error) {
                    logger.error(error.data.message);
                }
            );
        }

        function handleUpdateItem(item) {
            var modal = {
                title: vm.title,
                titleHeader: 'Edit ' + vm.title
            };

            var request = {
                method: 'PUT',
                body: item,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id }
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        console.log(response);
                        vm.option_table.data[
                            vm.option_table.data.indexOf(item)
                        ] = response;
                    }
                },
                function(error) {
                    logger.error(error.data.message);
                }
            );
        }

        function handleActivation(data, action) {
            var content = {
                header: action + ' ' + vm.title,
                message: MESSAGE.confirmMsg(action, vm.title.toLowerCase()),
                prop: data.code
            };

            ModalService.confirm_modal(content).then(
                function(response) {
                    if (!response) return;
                    executeActivateDeactivateDelete(data, action);
                },
                function(error) {
                    logger.error(error.data.message);
                }
            );
        }

        function executeActivateDeactivateDelete(data, action) {
            var request = {
                method: action == 'delete' ? 'DELETE' : 'PUT',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: data.id },
                cache: false
            };
            if (action != 'delete') request.route[action] = '';

            QueryService.query(request).then(
                function(response) {
                    vm.option_table.data.splice(vm.option_table.data.indexOf(
                        $filter('filter')(vm.option_table.data, {
                            id: data.id
                        })[0]
                    ), 1);
                    logger.success(vm.title + ' ' + action + 'd!');
                },
                function(err) {
                    console.log(err);
                }
            );
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            return data;
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }

        function trClick(data) {
            $state.go('app.hub-details', { id: data.id });
        }

        function filterTable(value, key) {
            $state.go($state.current.name, { 
                keyword: vm.keyword,
                page: '',
                limit: ''
            });
        }


    }
})();