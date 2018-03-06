import angular from 'angular';
import GLOBAL from 'Helpers/global';
import MESSAGE from 'Helpers/message';


;(function (){
    'use strict';

    angular.module('app').component('accountFormModal', {
        template: require('./account-form.html'),
        controller: AccountFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    AccountFormModalCtrl.$inject = [
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

    function AccountFormModalCtrl ($rootScope, $state, $cookies, $scope, $stateParams, $filter, $timeout, 
        QueryService, logger) {

        var vm = this;

        // methods
        vm.save = save;
        vm.cancel = cancel;
        vm.showTimeSlider = showTimeSlider;

        var Modal = null;
        var Request = null;

        vm.$onInit = function() {
            Modal = vm.resolve.Modal;
            Request = vm.resolve.Request;

            vm.titleHeader = Modal.titleHeader;
            vm.title = Modal.title;
            vm.data = angular.copy(Request.body);
            vm.storeData = [];

            vm.submitted = false; 
            vm.showSliders = false;

            if(angular.equals(vm.data,{})) {
                vm.data = {
                    positioning_time_delivery:"08:00 - 17:00",
                    positioning_time_pickup:"08:00 - 17:00",
                };
            } 

            $timeout(function(){
                setInitialDataForTime();
            });
            
        };

        function setInitialDataForTime() {
            var arr = getRange().map(n => {
                return {
                    value: n
                    // legend: n
                };
            });
            vm.positioningTimeD = {
                minValue:vm.data.positioning_time_delivery.slice(0, 5),
                maxValue:vm.data.positioning_time_delivery.slice(8, 13),
                options: {
                    stepsArray: arr,
                    noSwitching: true,
                    draggableRange: true,
                    minRange:12,
                    onChange:setDeliveryTime
                }
            };
    
            vm.positioningTimeP = {
                minValue: vm.data.positioning_time_pickup.slice(0, 5),
                maxValue: vm.data.positioning_time_pickup.slice(8, 13),
                options: {
                    stepsArray: arr,
                    noSwitching: true,
                    draggableRange: true,
                    minRange:12,
                    onChange:setPickupTime
                }
            };
        }

        function getRange() {
            var arr = ["00:00"];
            var d = new Date(2017, 1, 1);
            for (var i = 0; i < (6 * 48); i++) {
                d.setMinutes(d.getMinutes()+5);
                arr.push(leadZero(d.getHours()) + ':' + leadZero(d.getMinutes()));
            }
            return arr;

        }

        function leadZero(time) {
            return time < 10 ? '0' + time : time;
        }

        function setDeliveryTime (sliderId, modelValue, highValue) {
            //sliderId, modelValue, highValue, pointerType
            vm.data.positioning_time_delivery = modelValue + ' - ' + highValue;
        }
        function setPickupTime (sliderId, modelValue, highValue) {
            vm.data.positioning_time_pickup = modelValue + ' - ' + highValue;
        }


        // function save (data) { 

        //     var req = GLOBAL.toUpperCase(data);

        //     vm.disable = true; 
        //     Request.body = req;
        //     QueryService
        //         .query(Request)
        //         .then( function (response) { 
        //             if (Request.method === 'POST') {
        //                 logger.success(MSG.addSuccess + Modal.title);
        //                 data.dateCreated = new Date();
        //             } else if (Request.method === 'PUT') {
        //                 logger.success(MSG.updateSuccess + Modal.title );
        //                 data.message = response.data.data.message;
        //                 data.dateUpdated = new Date();
        //             }
        //             $uibModalInstance.close(data);
        //         }, function (error) { 
        //             logger.error(error.data.errors[0].context, '', error.data.errors[0].message);
        //         }).finally(function(){
        //             vm.disable = false;
        //         });
        // } 

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            vm.data.type = 'HUB';
            Request.body = vm.data;

            QueryService.query(Request)
                .then(
                    function(response) {
                        var response_data = response.data.data.items[0] || {};
                        logger.success(
                            MESSAGE.loggerSuccess(vm.title, Request.method)
                        );
                        vm.modalInstance.close(response_data);
                    },
                    function(error) {
                        console.log(err);
                        logger.error(
                            MESSAGE.loggerFailed(vm.title, Request.method)
                        );
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                    vm.disable = false;
                });
        }

        function cancel(data) {
            vm.modalInstance.close();
        }

        function showTimeSlider () {
            vm.showSliders = !vm.showSliders;
        }

    }
    
})();