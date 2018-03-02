import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';
import { GoogleCharts } from 'google-charts';

(function() {
    'use strict';

    angular.module('app').component('courierDetails', {
        template: require('./courier-details.html'),
        controller: CourierDetailsCtrl,
        controllerAs: 'vm'
    });

    CourierDetailsCtrl.$inject = [
        '$filter',
        '$scope',
        '$state',
        '$stateParams',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function CourierDetailsCtrl(
        $filter,
        $scope,
        $state,
        $stateParams,
        ModalService,
        QueryService,
        logger
    ) {
        var vm                  = this;
        vm.titleHeader          = 'Courier Details';
        vm.route_name           = 'couriers';
        vm.courier_id           = $stateParams.id;
        vm.per_page             = ['10', '20', '50', '100', '200'];
        vm.loading              = false;

        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';

        vm.option_table         = {
            emptyColumn         : true,
            defaultPagination   : true,
            hideSearchByKey     : true,
            searchTemplate      : true,
            tableSearch         : true
        };

        vm.delivery_data        = [
            ['Delivery', 'Percentage'],
            ['No Attempt', 60],
            ['Unsuccessful', 22],
            ['Successful', 18]
        ];
        vm.pickup_data          = [
            ['Pickup', 'Percentage'],
            ['No Attempt', 48],
            ['Unsuccessful', 22],
            ['Successful', 30]
        ];

        vm.courier_deliveries       = DUMMY.users.courier_deliveries;
        vm.courier_pickups          = DUMMY.users.courier_pickups;
        vm.option_table.columnDefs  = TABLES.courier_deliveries.columnDefs;
        vm.option_table.data        = vm.courier_deliveries;

        vm.selectTab            = selectTab;
        vm.getCourier           = getCourier;
        vm.updateCourier        = updateCourier;

        GoogleCharts.load(drawCharts);

        init();

        function init() { 
            getCourier($stateParams.site_id, $stateParams.user_id);
        }

        function selectTab(str) {
            getCourier(str);
        }

        function getCourier(site_id, user_id) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {},
                hasFile: false,
                route: { site:site_id, courier:user_id }, 
                cache: true,
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.courier = response.data.data;
                        vm.courier.fullname = ((vm.courier.last_name)?vm.courier.last_name+', ':'')+vm.courier.first_name+' '+vm.courier.middle_name;
                    },
                    function(err) {
                        logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function updateCourier(data) {
            var modal = { header: 'Update Courier' };
            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { site:data.site_id, courier:data.user_id },
                cache_string: vm.route_name
            };

            ModalService.form_modal(
                request,
                modal,
                'courierForm',
                'md',
                ''
            ).then(
                function(response) {
                    if (response) {
                        vm.courier = response;
                        vm.courier.fullname = ((vm.courier.last_name) ? vm.courier.last_name + ', ' : '') + vm.courier.first_name + ' ' + vm.courier.middle_name;
                    }
                },
                function(error) {
                    console.log(error);
                    // logger.error(error.data.message);
                }
            );
        }

        window.onresize = function() {
            GoogleCharts.load(drawCharts);
        };

        function drawCharts() {
            GLOBAL.drawChart(vm.delivery_data, 'delivery_chart');
            GLOBAL.drawChart(vm.pickup_data, 'pickup_chart');
        }
    }
})();
