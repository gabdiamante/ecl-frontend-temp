import angular from 'angular';
import GLOBAL from 'Helpers/global';
import UTILS from 'Helpers/util';

var moment = require('moment');

(function() {
    'use strict';

    angular.module('app').component('importExport', {
        template: require('./import-export.html'),
        controller: ImportExportCtrl,
        controllerAs: 'vm'
    });

    ImportExportCtrl.$inject = [
        '$rootScope',
        '$state',
        '$scope',
        '$stateParams',
        '$cookies',
        '$cacheFactory',
        'QueryService',
        'ViewService',
        'logger',
        'Upload'
    ];

    function ImportExportCtrl(
        $rootScope,
        $state,
        $scope,
        $stateParams,
        $cookies,
        $cacheFactory,
        QueryService,
        ViewService,
        logger,
        Upload
    ) {
        var vm = this;
        vm.user = GLOBAL.user($cookies, $state);
        vm.csv = '';
        vm.action = 'import';
        vm.item = {};
        vm.duplicates = [];
        vm.activateBtn = false;
        vm.showDuplicates = false;
        vm.dateFormat = UTILS.dateFormat;
        vm.moduleItems = UTILS.moduleItems;
        vm.date = {
            start: moment().format(vm.dateFormat),
            end: moment().format(vm.dateFormat)
        };
        vm.dateParams = vm.date;

        vm.selectItem = selectItem;
        vm.uploadFile = uploadFile;
        vm.downloadFile = downloadFile;
        vm.hideDuplicates = hideDuplicates;
        vm.calendarOnOpen = calendarOnOpen;
        vm.calendarOnCancel = calendarOnCancel;
        vm.calendarOnConfirm = calendarOnConfirm;

        init();

        function init() {
            vm.titleHeader = 'Import/Export';
        }

        function selectItem(item) {
            vm.item = item;
        }

        function uploadFile(item, file, key) {
            var url = GLOBAL.set_url(item.import);
            Upload.upload({
                url: url,
                data: { [key]: file },
                headers: GLOBAL.header(vm.user.token)
            }).then(
                function(response) {
                    logger.success(response.data.data.message);
                },
                function(error) {
                    if (!error.data.message) {
                        logger.errorFormatResponse(error);
                    } else {
                        logger.error(error.data.message);
                        vm.errorMsg = error.data.message;
                        vm.duplicates = error.data.duplicates;
                    }
                    vm.csv = '';
                },
                function(evt) {
                    vm.progress = {};
                    vm.progress[key] = Math.min(
                        100,
                        parseInt(100.0 * evt.loaded / evt.total)
                    );
                }
            );
        }

        function downloadFile(item, key) {
            var req = {
                method: 'GET',
                body: {},
                token: vm.user.token,
                params: {},
                hasFile: false,
                cache: false,
                route: item.export,
                cache_string: []
            };
            QueryService.query(req).then(
                function(response) {
                    var count = (
                        response.data.match(new RegExp('\n', 'g')) || []
                    ).length;
                    var blob = new Blob([response.data], {
                        type: 'text/plain;charset=utf-8'
                    });
                    // saveAs(blob, key+'['+vm.dateParams.start+']-['+ vm.dateParams.end +'].csv');
                    saveAs(blob, key + '.csv');
                    logger.success(
                        'Successfully exported ' + count + ' ' + key
                    );
                },
                function(error) {
                    logger.errorFormatResponse(error);
                }
            );
        }

        function calendarOnOpen() {
            vm.calendarActive = true;
            vm.activateBtn = true;
            vm.calendarStart = vm.date.start;
            vm.calendarEnd = vm.date.end;
        }

        function calendarOnConfirm(start, end) {
            vm.calendarActive = false;
            vm.dateParams = {
                end: moment(end).format(vm.dateFormat),
                start: moment(start).format(vm.dateFormat)
            };
            vm.date = vm.dateParams;
        }

        function calendarOnCancel(state) {
            vm.calendarActive = state;
        }

        function hideDuplicates() {
            vm.duplicates = [];
        }
    }
})();
