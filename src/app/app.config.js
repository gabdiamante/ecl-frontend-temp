import angular from 'angular';

(function() {
    'use strict';

    angular
        .module('app')
        .factory('httpRequestInterceptor', [
            'SessionService',
            function(SessionService) {
                return {
                    request: function(config) {
                        // Get the token from session service
                        var token = SessionService.getToken();

                        // Attach an x-access-token header to the request
                        // With the token from sesison service as value
                        config.headers['x-access-token'] = token;

                        return config;
                    }
                };
            }
        ])
        .config([
            '$httpProvider',
            function($httpProvider) {
                // Add our created http interceptor
                $httpProvider.interceptors.push('httpRequestInterceptor');
            }
        ])
        .config([
            'toastrConfig',
            function(toastrConfig) {
                // Configure the toastr container
                angular.extend(toastrConfig, {
                    // autoDismiss: false,
                    // containerId: 'toast-container',
                    maxOpened: 4,
                    // newestOnTop: true,
                    positionClass: 'toast-bottom-right'
                    // preventDuplicates: false,
                    // preventOpenDuplicates: false,
                    // target: 'body'
                });

                // Configure the toastr itself
                angular.extend(toastrConfig, {
                    // allowHtml: false,
                    // closeButton: false,
                    // closeHtml: '<button>&times;</button>',
                    extendedTimeOut: 1000,
                    // iconClasses: {
                    //     error: 'toast-error',
                    //     info: 'toast-info',
                    //     success: 'toast-success',
                    //     warning: 'toast-warning'
                    // },
                    // messageClass: 'toast-message',
                    // onHidden: null,
                    // onShown: null,
                    // onTap: null,
                    // progressBar: false,
                    // tapToDismiss: true,
                    // templates: {
                    //     toast: 'directives/toast/toast.html',
                    //     progressbar: 'directives/progressbar/progressbar.html'
                    // },
                    timeOut: 4000
                    // titleClass: 'toast-title',
                    // toastClass: 'toast'
                });
            }
        ])
        .config(router)
        .run([
            '$transitions',
            function($transitions) {
                // checks if not authenticated when going to app.** routes
                $transitions.onBefore({ to: 'app.**' }, function(trans) {
                    var SessionService = trans.injector().get('SessionService');

                    if (!SessionService.getUser()) {
                        // redirects to login
                        return trans.router.stateService.target('login');
                    }
                });

                // checks if already authenticated when going to login route
                $transitions.onBefore({ to: 'login' }, function(trans) {
                    var SessionService = trans.injector().get('SessionService');

                    // redirects to dashboard (?)
                    if (SessionService.getUser()) {
                        return trans.router.stateService.target(
                            'app.dashboard'
                        );
                    }
                });
            }
        ]);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/',
                views: {
                    navbar: {
                        component: 'navbar'
                    },
                    sidebar: {
                        component: 'sidebar'
                    },
                    content: {
                        component: 'content'
                    }
                }
            })

            .state('app.dashboard', {
                url: 'dashboard',
                component: 'dashboard'
            })

            .state('app.monitoring', {
                url: 'monitoring',
                component: 'monitoring'
            })

            //DELIVERIES
            .state('app.deliveries-bad-address', {
                url: 'deliveries/bad-address',
                component: 'deliveriesBadAddress'
            })

            .state('app.deliveries-staging', {
                url: 'deliveries/staging',
                component: 'deliveriesStaging'
            })

            .state('app.deliveries-dispatched', {
                url: 'deliveries/dispatched',
                component: 'deliveriesDispatched'
            })

            .state('app.delivery-details', {
                url: 'delivery-details?id',
                component: 'deliveryDetails'
            })

            //PICKUPS
            .state('app.pickups-bad-address', {
                url: 'pickups/bad-address',
                component: 'pickupsBadAddress'
            })

            .state('app.pickups-staging', {
                url: 'pickups/staging',
                component: 'pickupsStaging'
            })

            .state('app.pickups-dispatched', {
                url: 'pickups/dispatched',
                component: 'pickupsDispatched'
            })

            .state('app.pickup-details', {
                url: 'pickup-details?id',
                component: 'pickupDetails'
            })

            // USERS
            .state('app.couriers', {
                url: 'couriers?page&limit&search',
                component: 'couriers'
            })

            .state('app.courier-details', {
                url: 'courier-details?id',
                component: 'courierDetails'
            })

            .state('app.dispatchers', {
                url: 'dispatchers',
                component: 'dispatchers'
            })

            .state('app.hub-supports', {
                url: 'hub-supports',
                component: 'hubSupports'
            })

            .state('app.merchants', {
                url: 'merchants',
                component: 'merchants'
            })

            .state('app.personnels', {
                url: 'personnels',
                component: 'personnels'
            })

            .state('app.distribution-centers', {
                url: 'distribution-centers',
                component: 'dcs'
            })

            //DATA-MANAGEMENT
            .state('app.hubs', {
                url: 'hubs',
                component: 'hubs'
            })

            .state('app.hub-details', {
                url: 'hub-details?id',
                component: 'hubDetails'
            })

            .state('app.vehicles', {
                url: 'vehicles',
                component: 'vehicles'
            })

            .state('app.zones', {
                url: 'zones',
                component: 'zones'
            })

            .state('app.import-export', {
                url: 'import-export',
                component: 'importExport'
            })

            .state('app.history', {
                url: 'history',
                component: 'history'
            })

            .state('app.settings', {
                url: 'settings',
                component: 'settings'
            })

            .state('login', {
                url: '/login',
                views: {
                    content: {
                        component: 'login'
                    }
                }
            })
            .state('resetPassword', {
                url: '/password_reset/:token',
                views: {
                    content: {
                        component: 'resetPassword'
                    }
                }
            });
    }
})();
