import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('pickupDetails', {
        template: require('./pickup-details.html'),
        controller: PickupDetailsCtrl,
        controllerAs: 'vm'
    });

    PickupDetailsCtrl.$inject = [
        '$filter',
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PickupDetailsCtrl(
        $filter,
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.titleHeader = 'Pickup Details';
        vm.loading = false;
        vm.route_name = 'booking';
        vm.id = $stateParams.id;

        init();

        function init() {
            // vm.data = $filter('filter')(DUMMY.users.courier_pickups, {
            //     booking_code: $stateParams.id
            // })[0];
            // vm.titleHeader = vm.data.code;
            getData();
        }

        function getData () {
            vm.isLoading = true;
    
            var req =  { 
                method  : 'GET', 
                body    : false,
                params  : false, 
                hasFile : false, 
                cache   : true,
                route   : { [vm.route_name] : vm.id } ,
                ignoreLoadingBar:true
            };

            QueryService
                .query(req)
                .then(function (response) { 
                    console.log(response);
                    vm.data = response.data.data.items[0];
                }, function (error) { 
                    logger.errorFormatResponse(error);
                    vm.isLoading = false;
                });
        }




    }
})();
