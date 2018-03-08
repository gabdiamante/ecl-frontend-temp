import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MSG from 'Helpers/message';
import CONSTANTS from 'Helpers/constants';

(function (){
    'use strict';

    angular.module('app').component('courierListFormModal', {
        template: require('./courier-list-form.html'),
        controller: CourierListFormCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    CourierListFormCtrl.$inject = [
        '$rootScope', 
        '$state', 
        '$cookies', 
        '$scope', 
        '$stateParams',
        '$filter',
        '$timeout',
        'QueryService',
        'logger'
    ];


    function CourierListFormCtrl ($rootScope, $state, $cookies, $scope, $stateParams, $filter, $timeout, 
        QueryService, logger) {
        
        var vm = this;

       
        vm.assign = assign;
        vm.cancel = cancel; 
        vm.transferToCourier = transferToCourier;
        vm.dispatchToCourier = dispatchToCourier;

        var Modal = null;
        var Request = null;

        vm.$onInit = function() {
            
            Modal = vm.resolve.Modal;
            Request = vm.resolve.Request;

            vm.user = GLOBAL.user($cookies, $state);
            vm.titleHeader = Modal.titleHeader;
            vm.data = angular.copy(Request.body); 
            vm.submitted = false; 
            vm.ph=GLOBAL.pcc;
            vm.transfer = Request.transfer;
            vm.dispatch = Request.dispatch;
    

            getList();
        };

        function getList (key) {
            vm.isLoading = true;
            var req =  { 
                method  : 'GET', 
                body    : Request.body,
                token   : vm.user.token, 
                params  : Request.params || {}, 
                hasFile : false, 
                cache   : true,
                route   : Request.route,
                cache_string:['courierList']
            };

            QueryService
                .query(req)
                .then(function (response) { 
                    console.log(response);
                    vm.list = response.data.data.items;
                    GLOBAL.sortOn(vm.list,'last_name');
                    vm.isLoading = false;
                }, function (error) { 
                    vm.list=[];
                    logger.errorFormatResponse(error);
                    vm.isLoading = false;
                });
        }

        function assign (data) { 
            Request.body.newCourier = data.id;

            var route = {
                express:'', 
                courier:data.id,
                vehicle:Request.body.id
            };
            if(Request.body.courId) {
                route.courier = Request.body.courId;
                route.reassign="";
            }

            var req = {
                method:'PUT',
                body:Request.body,
                token:vm.user.token,
                route: route,
                cache_string:['vehicles', 'couriers', 'courierList']
            };
           QueryService
                .query(req)
                .then(function (response) {
                    response.data.data.firstName=data.firstName;
                    response.data.data.lastName=data.lastName;
                    vm.modalInstance.close(response);
                }, function (error) { 
                    logger.errorFormatResponse(error);
                    vm.modalInstance.close(false);
                    vm.isLoading = false;
                });
        } 


        function transferToCourier (data) {
            ///express/assignments/transfer/:id
            var route = {
                express:'', 
                assignments:"",
                transfer:data.id
            };

            Request.body.courierId = data.id;

            var req = {
                method:'PUT',
                body:Request.body,
                token:vm.user.token,
                route: route,
                cache_string:['assignments', 'couriers', 'courierList']
            };
           QueryService
                .query(req)
                .then(function (response) {
                    vm.modalInstance.close(response);                    
                    logger.success('','',MSG.successfulTransfer);
                }, function (error) { 
                    console.log(error);
                    logger.errorFormatResponse(error);
                    vm.modalInstance.close(false);
                    vm.isLoading = false;
                });
        }
        
        function dispatchToCourier (data) {
            console.log(Request.body);
            var route;
            if(Request.body.awbIds) {
                route = {
                    express:'', 
                    deliveries:"",
                    dispatch:data.id
                };
            } else if(Request.body.bookingIds) {
                route = {
                    express:'', 
                    bookings:"",
                    dispatch:data.id
                };
            }
            
            Request.body.courierId = data.id;

            var req = {
                method:'PUT',
                body:Request.body,
                token:vm.user.token,
                route: route,
                cache_string:['assignments', 'couriers', 'courierList']
            };
           QueryService
                .query(req)
                .then(function (response) {
                    vm.modalInstance.close(response);                    
                    logger.success('','',response.data.data.message);
                }, function (error) { 
                    console.log(error);
                    logger.errorFormatResponse(error);
                    vm.modalInstance.close(false);
                    vm.isLoading = false;
                });
        }

        function cancel () { 
            vm.modalInstance.close(false);
        }

    
    } //controller

})();
