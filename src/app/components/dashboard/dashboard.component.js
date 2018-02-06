import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';

(function() {
    'use strict';

    angular.module('app').component('dashboard', {
        template: require('./dashboard.html'),
        controller: DashboardCtrl,
        controllerAs: 'vm'
    });

    DashboardCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function DashboardCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm          = this;
        vm.titleHeader  = 'Dashboard';
        vm.limit        = '20';
        vm.page         = '1';
        vm.per_page     = ['10','20','50','100','200'];
        vm.items        = { roleUserCheck:[] };

        vm.option_table   = { 
            emptyColumn: true,
            searchTemplate: true, 
            hideSearchByKey:true 
        };

        vm.option_table.columnDefs = TABLES.users.columnDefs;  
        vm.option_table.data = [];

        getData ();
    
        function getData () {
            var request = {
                method  : 'GET', 
                body    : false, 
                params  : {per_page: 10}, 
                hasFile : false, 
                route   : { users:'' }, 
                cache   : true, 
                cache_string : 'user'
            };

            QueryService
                .query(request)
                .then(function (response) { 
                    vm.option_table.data = handleNames(response.data.data); 
                }, function (err) {
                    logger.error(MESSAGE.error, err, '');
                });
        }

        function handleNames (data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            return data;
        }

        vm.toggleCheckRoleUserAll = (checkbox, model_name,propertyName) => { 
            // var values_of_id = _.pluck(vm.option_table.data, propertyName);
            if (checkbox) 
                GLOBAL.getModel(vm.items, model_name, angular.copy(vm.option_table.data));
            else 
                GLOBAL.getModel(vm.items, model_name, []); 
        }; 
    } 
})();
