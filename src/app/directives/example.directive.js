;(function (){
    'use strict';

    angular
        .module('app')
        .directive('exampleDirective', exampleDirective);

    function exampleDirective () {
        return {
            'restrict' : "EA", 
            'templateUrl' : "this/is/the/path/of/template.html"
        };
    }

})();