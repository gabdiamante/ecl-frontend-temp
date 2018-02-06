;(function (){
    'use strict';

    angular
        .module('app')
        .directive('dynamicTable', dynamicTable);

    function dynamicTable () {
        return {
            restrict: 'EA',
            scope : { 
                splitString : '&',
                trClick : '&',
                details : '=details',
                filters : '=filters',
                filterData : '=filterData'
            },
            templateUrl: "app/directives/html/dynamic-table-directive.html" 
        };
    }

})();