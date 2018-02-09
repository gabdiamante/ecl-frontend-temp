import angular from 'angular';
<<<<<<< HEAD
import GLOBAL from 'Helpers/global'; 
import TABLES from 'Helpers/tables';
import {GoogleCharts} from 'google-charts';
=======
import GLOBAL from 'Helpers/global';
>>>>>>> master

(function() {
    'use strict';

    angular.module('app').component('courierDetails', {
        template: require('./courier-details.html'),
        controller: CourierDetailsCtrl,
        controllerAs: 'vm'
    });

    CourierDetailsCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function CourierDetailsCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        logger
    ) {
        var vm          = this;
        vm.titleHeader  = 'Courier Details';
        vm.loading      = false;
        vm.option_table = { 
            emptyColumn: true,
            defaultPagination: true, 
            hideSearchByKey: true,
            searchTemplate:true,
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
        vm.courier_deliveries = [
            { airway_bill:'awb-001', shipper:'shipper-001', consignee:'cnee-001', status:'successful', checkin:new Date(), checkout:new Date() },
            { airway_bill:'awb-002', shipper:'shipper-002', consignee:'cnee-002', status:'failed', checkin:new Date(), checkout:new Date() },
            { airway_bill:'awb-003', shipper:'shipper-003', consignee:'cnee-003', status:'successful', checkin:new Date(), checkout:new Date() },
            { airway_bill:'awb-004', shipper:'shipper-004', consignee:'cnee-004', status:'failed', checkin:new Date(), checkout:new Date() }
        ];
        vm.courier_pickups = [
            { booking_code:'book-001', shipper:'shipper-001', consignee:'cnee-001', status:'successful', checkin:new Date(), checkout:new Date() },
            { booking_code:'book-002', shipper:'shipper-002', consignee:'cnee-002', status:'failed', checkin:new Date(), checkout:new Date() },
            { booking_code:'book-003', shipper:'shipper-003', consignee:'cnee-003', status:'successful', checkin:new Date(), checkout:new Date() },
            { booking_code:'book-004', shipper:'shipper-004', consignee:'cnee-004', status:'failed', checkin:new Date(), checkout:new Date() },
            { booking_code:'book-005', shipper:'shipper-005', consignee:'cnee-005', status:'failed', checkin:new Date(), checkout:new Date() },
            { booking_code:'book-006', shipper:'shipper-006', consignee:'cnee-006', status:'successful', checkin:new Date(), checkout:new Date() }
        ];
        vm.option_table.columnDefs = TABLES.courier_deliveries.columnDefs;  
        vm.option_table.data = vm.courier_deliveries;

        vm.selectTab    = selectTab;
        vm.getCourier   = getCourier;

        init();

        function init () {

        }

        GoogleCharts.load(drawCharts);
 
        function drawCharts() {
            GLOBAL.drawChart(vm.delivery_data, 'delivery_chart');
            GLOBAL.drawChart(vm.pickup_data, 'pickup_chart'); 
        }

        function selectTab (str) { 
            getCourier(str);
        }

        function getCourier (str) {
            vm.option_table.columnDefs = TABLES[str].columnDefs;
            vm.option_table.data = vm[str];
        }
    } 
})();
