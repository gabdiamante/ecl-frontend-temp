import angular  from 'angular';
import GLOBAL   from 'Helpers/global';

(function () {
    'use strict';

    angular
        .module('app')
        .component('courierForm', {
            template : require('./courier-form.html'),
            controller : CourierFormCtrl,
            controllerAs : 'vm',
            bindings : {
                modalInstance : '<',
                resolve : '<'
            }
        });

    CourierFormCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams', 
        '$filter',
        'QueryService',
        'ModalService',
        'logger' 
    ];

    function CourierFormCtrl(
        $rootScope, 
        $state, 
        $cookies, 
        $scope, 
        $stateParams, 
        $filter, 
        QueryService, 
        ModalService, 
        logger 
    ) {

        var vm              = this;
        var Modal           = null;
        var Request         = null;
        vm.user             = {};
        vm.item             = {};
        vm.selected_accoutn = '';
        vm.submitted        = false;

        vm.$onInit = function () {
            Modal           = vm.resolve.Modal;
            Request         = vm.resolve.Request;
            vm.titleHeader  = Modal.header;
            vm.data         = angular.copy(Request.body);
        }; 

        vm.save = save;
        vm.cancel = cancel; 

        init();

        function init() { 
            
        }

        function save(data) {

            vm.disable = true;
            Request.body = GLOBAL.setToUpperCase(angular.copy(data)); 
            vm.modalInstance.close(vm.data);
        }

        function cancel() {
            vm.modalInstance.close(false);
        }

    }

})(); 