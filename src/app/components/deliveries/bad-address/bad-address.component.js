// import angular from 'angular';
// import GLOBAL from 'Helpers/global';
// import TABLES from 'Helpers/tables';
// import DUMMY from 'Helpers/dummy';

// (function() {
//     'use strict';

//     angular.module('app').component('deliveriesBadAddress', {
//         template: require('./bad-address.html'),
//         controller: DeliveriesBadAddressCtrl,
//         controllerAs: 'vm'
//     });

//     DeliveriesBadAddressCtrl.$inject = [
//         '$scope',
//         '$state',
//         '$stateParams',
//         'ModalService',
//         'QueryService',
//         'logger'
//     ];

//     function DeliveriesBadAddressCtrl(
//         $scope,
//         $state,
//         $stateParams,
//         ModalService,
//         QueryService,
//         logger
//     ) {
//         var vm = this;
//         vm.titleHeader = 'Bad Address';
//         vm.pagination = {};
//         vm.pagination.pagestate = $stateParams.page || '1';
//         vm.pagination.limit = $stateParams.limit || '10';
//         vm.per_page = ['10', '20', '50', '100', '200'];
//         vm.total_page = '1';
//         vm.total_items = '0';
//         vm.items = { roleUserCheck: [] };
//         vm.loading = false;

//         vm.option_table = { 
//             defaultPagination: true,
//             hideSearchByKey: true,
//             searchTemplate: true 
//         };

//         vm.option_table.data = [];
//         vm.option_table.columnDefs = TABLES.delivery_bad_address.columnDefs;

//         getData();

//         function getData() {
//             var request = {
//                 method: 'GET',
//                 body: false,
//                 params: { per_page: 10 },
//                 hasFile: false,
//                 route: { users: '' },
//                 cache: true,
//                 cache_string: 'user'
//             };

//             QueryService.query(request).then(
//                 function(response) {
//                     vm.option_table.data = DUMMY.users.courier_deliveries;
//                     // vm.option_table.data = handleNames(response.data.data);
//                 },
//                 function(err) {
//                     logger.error(MESSAGE.error, err, '');
//                 }
//             );
//         }

//         function handleNames(data) {
//             for (let i = 0; i < data.length; i++) {
//                 data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
//             }
//             return data;
//         }

//         vm.toggleCheckRoleUserAll = (checkbox, model_name, propertyName) => {
//             // var values_of_id = _.pluck(vm.option_table.data, propertyName);
//             if (checkbox)
//                 GLOBAL.getModel(
//                     vm.items,
//                     model_name,
//                     angular.copy(vm.option_table.data)
//                 );
//             else GLOBAL.getModel(vm.items, model_name, []);
//         };
//     }
// })();
