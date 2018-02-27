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
            .state('app.deliveries-bad_address', {
                url: 'deliveries_v1?view&page&limit',
                component: 'deliveriesBadAddress'
            })

            .state('app.deliveries-staging', {
                url: 'deliveries_v2?view&page&limit',
                component: 'deliveriesStaging'
            })

            .state('app.deliveries-dispatched', {
                url: 'deliveries_v3?view&page&limit',
                component: 'deliveriesDispatched'
            })

            .state('app.delivery-details', {
                url: 'delivery-details?id',
                component: 'deliveryDetails'
            })

            //PICKUPS
            .state('app.pickups-bad_address', {
                url: 'pickups_v1?view&page&limit',
                component: 'pickupsBadAddress'
            })

            .state('app.pickups-staging', {
                url: 'pickups_v2?view&page&limit',
                component: 'pickupsStaging'
            })

            .state('app.pickups-dispatched', {
                url: 'pickups_v3?view&page&limit',
                component: 'pickupsDispatched'
            })

            .state('app.pickup-details', {
                url: 'pickup-details?id',
                component: 'pickupDetails'
            })

            // USERS
            .state('app.couriers', {
                url: 'couriers?page&limit&key&deactivated&site&zone',
                component: 'couriers'
            })

            .state('app.courier-details', {
                url: 'courier-details?user_id&site_id',
                component: 'courierDetails'
            })

            .state('app.dispatchers', {
                url: 'dispatchers?deactivated&page&limit&search',
                component: 'dispatchers'
            })

            .state('app.dispatcher-details', {
                url: 'dispatcher-details?site_id&user_id',
                component: 'dispatcherDetails'
            })

            .state('app.hub-supports', {
                url: 'hub-supports?page&limit&deactivated',
                component: 'hubSupports'
            })

            .state('app.hub-support-details', {
                url: 'hub-support-details?&user_id&site_id',
                component: 'hubSupportDetails'
            })

            .state('app.customer-supports', {
                url: 'customer-supports?page&limit&deactivated',
                component: 'customerSupports'
            })

            .state('app.customer-support-details', {
                url: 'customer-support-details?&user_id&site_id',
                component: 'customerSupportDetails'
            })

            .state('app.merchants', {
                url: 'merchants',
                component: 'merchants'
            })

            .state('app.personnels', {
                url: 'personnels?deactivated&page&limit&search',
                component: 'personnels'
            })

            .state('app.personnel-details', {
                url: 'personnel-details?site_id&user_id',
                component: 'personnelDetails'
            })

            //DATA-MANAGEMENT
            .state('app.hubs', {
                url: 'hubs?deactivated&page&limit&search',
                component: 'hubs'
            })

            .state('app.hub-details', {
                url: 'hub-details?id',
                component: 'hubDetails'
            })

            .state('app.distribution-centers', {
                url: 'distribution-centers?deactivated&page&limit&search',
                component: 'dcs'
            })

            .state('app.dc-details', {
                url: 'dc-details?id',
                component: 'dcsDetails'
            })

            .state('app.vehicles', {
                url: 'vehicles?deactivated&page&limit&search',
                component: 'vehicles'
            })

            .state('app.vehicle-details', {
                url: 'vehicle-details?id',
                component: 'vehicleDetails'
            })

            .state('app.zones', {
                url: 'zones?siteType&siteFront&siteId&includeUnassigned&filterClose&zoom&center_map_lat_lng&deactivated',
                component: 'zones'
            })

            .state('app.bins', {
                url: 'bins?deactivated&page&limit&search',
                component: 'bins'
            })

            .state('app.bin-details', {
                url: 'bin-details?id',
                component: 'binDetails'
            })

            .state('app.packaging-codes', {
                url: 'packaging-codes?deactivated&page&limit&search',
                component: 'packagingCodes'
            })

            .state('app.packaging-code-details', {
                url: 'packaging-code-details?id',
                component: 'packagingCodeDetails'
            })

            //IMPORT/EXPORT
            .state('app.import-export', {
                url: 'import-export',
                component: 'importExport'
            })

            //HISTORY
            .state('app.history', {
                url: 'history',
                component: 'history'
            })
            //SETTINGS
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
