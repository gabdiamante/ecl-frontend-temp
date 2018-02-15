import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').factory('ViewService', ViewService);

    ViewService.$inject = ['$http', '$q', '$rootScope', '$cacheFactory'];

    function ViewService($http, $q, $rootScope, $cacheFactory) {
        this.active = true;
        var service = {
            toggleBtn: toggleBtn
        };

        return service;

        function toggleBtn() {
            this.active = !this.active;
        }
    }
})();
