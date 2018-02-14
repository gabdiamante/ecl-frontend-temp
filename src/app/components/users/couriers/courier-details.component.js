import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
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
        var vm = this;
        vm.titleHeader = 'Courier Details';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.loading = false;
        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true,
            tableSearch: true
        };

        vm.delivery_data = [
            ['Delivery', 'Percentage'],
            ['No Attempt', 60],
            ['Unsuccessful', 22],
            ['Successful', 18]
        ];
        vm.pickup_data = [
            ['Pickup', 'Percentage'],
            ['No Attempt', 48],
            ['Unsuccessful', 22],
            ['Successful', 30]
        ];
        vm.courier_deliveries = DUMMY.users.courier_deliveries;
        vm.courier_pickups = DUMMY.users.courier_pickups;
        vm.option_table.columnDefs = TABLES.courier_deliveries.columnDefs;
        vm.option_table.data = vm.courier_deliveries;

        vm.selectTab = selectTab;
        vm.getCourier = getCourier;
        vm.updateCourier = updateCourier;

        init();

        function init() {
            vm.courier = $filter('filter')(DUMMY.users.couriers, {
                id: $stateParams.id
            })[0];
            console.log(vm.courier);
        }

        GoogleCharts.load(drawCharts);

        function drawCharts() {
            GLOBAL.drawChart(vm.delivery_data, 'delivery_chart');
            GLOBAL.drawChart(vm.pickup_data, 'pickup_chart');
        }

        function selectTab(str) {
            getCourier(str);
        }

        function getCourier(str) {
            vm.option_table.columnDefs = TABLES[str].columnDefs;
            vm.option_table.data = vm[str];
        }

        function updateCourier(data) {
            var modal = { header: 'Update Courier' };
            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: '' },
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
                    }
                },
                function(error) {
                    logger.error(error.data.message);
                }
            );
        }

        window.onresize = function() {
            GoogleCharts.load(drawCharts);
        };
    }
})();
