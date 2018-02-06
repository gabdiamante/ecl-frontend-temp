;(function (){
    'use strict';

    angular
        .module('app')
        .directive('resetForm', resetForm);

    function resetForm ($parse) {
        return function(scope, element, attr) { 
            setTimeout( function () {
                var fn = $parse(attr.resetForm);
                var masterModel = angular.copy(fn(scope)); 
                if (!fn.assign) {
                    throw Error( 'Expression is required to be a model: ' + attr.resetForm );
                }

                element.bind( 'reset', function ( event ) { 

                    scope.$apply( function () {
                        fn.assign( scope, angular.copy( masterModel ) ); 
                    }); 

                    if ( event.preventDefault ) {
                        return event.preventDefault();
                    }
                    else {
                        return false;
                    }

                });
            }, 1000);
        };
    }

})(); 