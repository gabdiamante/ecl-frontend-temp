import angular from 'angular';
import GLOBAL from 'Helpers/global';

(function() {
    'use strict';

    angular.module('app').component('zonesFormModal', {
        template: require('./zoneform.html'),
        controller: ZonesFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    ZonesFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function ZonesFormModalCtrl(
        $rootScope,
        $state,
        $cookies,
        $scope,
        $stateParams,
        $filter,
        QueryService,
        logger
    ) {
        var vm = this;

        // methods
        vm.save = save;
        vm.cancel = cancel;

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            vm.storeData = [];
        };

        function save(data) {
            vm.disable = true;

            Request.body = req;
            QueryService.query(Request)
                .then(
                    function(response) {
                        if (Request.method === 'POST') {
                            logger.success(MSG.addSuccess + Modal.title);
                            response.data.data.dateCreated = new Date();
                        } else if (Request.method === 'PUT') {
                            logger.success(MSG.updateSuccess + Modal.title);
                        }
                        $uibModalInstance.close(response.data.data);
                    },
                    function(error) {
                        logger.error(
                            error.data.errors[0].context,
                            '',
                            error.data.errors[0].message
                        );
                    }
                )
                .finally(function() {
                    vm.disable = false;
                });

            // vm.disable              = true;
            // Request.body            = angular.copy(GLOBAL.setToUpperCase(messenger));
            // Request.body.polygon    = angular.copy(Modal.polygon) || null;
            // for (var i in Request.body.zone_tags)
            //     Request.body.zone_tags[i].text = Request.body.zone_tags[i].text.toUpperCase();
            // QueryService
            //     .query(Request)
            //     .then( function (response) {
            //         if(Request.method == 'POST') {
            //                 Request.body.id = response.data.data.items[0].id;
            //                 vm.storeData.unshift(Request.body);
            //                 close(vm.storeData, action);
            //                 vm.data = {};
            //                 logger.success('New '+Modal.title+' added.');
            //         } else {
            //             close(Request.body, action);
            //             logger.success(Modal.title+' updated.');
            //         }
            //     }, function (error) {
            //         logger.error(error.data.message || 'Cannot established URL:' + GLOBAL.set_url(Request.route));
            //     }).finally( function () {
            //         vm.disable = false;
            //     });
        }

        function close(data, action) {
            if (action == 'save') {
                vm.storeData = data;
                vm.submitted = false;
            } else {
                vm.modalInstance.close(data);
            }
        }

        function cancel(data) {
            if (GLOBAL.obj_length(vm.storeData)) {
                vm.modalInstance.close(vm.storeData);
            } else {
                vm.modalInstance.close();
            }
        }

        // function ConfirmationModalCtrl($scope, $cookies, $timeout, QueryService) {
        //     var vm = this;
        //     var ids = null;

        //     vm.content = null;

        //     vm.approve = approve;
        //     vm.cancel = cancel;

        //     vm.$onInit = function() {
        //         ids = angular.copy(vm.resolve.props.keys);
        //         vm.content = angular.copy(vm.resolve.props);
        //     };

        //     function approve() {
        //         vm.modalInstance.close(true);
        //     }

        //     function cancel() {
        //         vm.modalInstance.close(false);
        //     }
        // }
    }
})();
