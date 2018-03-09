import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
    
        var service = {
            showToasts: true,

            error: error,
            errorFormatResponse: errorFormatResponse,
            info: info,
            success: success,
            warning: warning,

            log: $log.log
        };

        return service;

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }

        function errorFormatResponse(error) {
            console.log('status',error);
            //console.log(error);
            if (error.status == -1) service.error('Connection refused!');
            else if (error.status == 404) {
                // service.error('Route Not Found!');
            }
            else if (error.status == 500) service.error(error.data.message);
            else
                service.error(
                    error.data.errors[0].message,
                    {},
                    error.data.errors[0].code
                );
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.log('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warning('Warning: ' + message, data);
        }
    }
})();
