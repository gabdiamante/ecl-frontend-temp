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
                        config = config || {};
                        config.passToken = (typeof config.passToken == 'undefined') ? true : config.passToken;

                        if (config.passToken)
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
        .run(removeSocket)
        .config(router)
        .config(['cfpLoadingBarProvider','$qProvider', function(cfpLoadingBarProvider, $qProvider) {
            cfpLoadingBarProvider.includeBackdrop = true;
            //$qProvider.errorOnUnhandledRejections(false);
         }])
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

    function removeSocket ($rootScope, $state, SocketService) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            
            if(fromParams.courier !== localStorage.courier) {
                // unlistenToCourier
                SocketService.emit('unlistenToCourier', {courierId:fromParams.courier}, function(data) {
                    logger.log(data);
                });
            }

            if(fromState.url == 'monitoring?hub&courier' || fromState =='courier?id&view') { 
                SocketService.removeAllListeners();
            } 
        });
    }

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
                url: 'monitoring?courier',
                component: 'monitoring'
            })

            //DELIVERIES
            .state('app.deliveries-bad_address', {
                url: 'deliveries_v1?view&page&limit&siteId',
                component: 'deliveriesBadAddress'
            })

            .state('app.deliveries-staging', {
                url: 'deliveries_v2?view&page&limit&siteId&zoneId',
                component: 'deliveriesStaging'
            })

            .state('app.deliveries-dispatched', {
                url: 'deliveries_v3?view&page&limit&siteId&zoneId',
                component: 'deliveriesDispatched'
            })

            .state('app.delivery-details', {
                url: 'delivery-details?id',
                component: 'deliveryDetails'
            })

            .state('cmr-drs', {
                url: '/print?date&hubId&courierId&vehicleId',
                views: {
                    content: {
                        component: 'cmrDrsSheet'
                    }
                }
            })

            //PICKUPS
            .state('app.pickups-bad_address', {
                url: 'pickups_v1?view&page&limit&siteId',
                component: 'pickupsBadAddress'
            })

            .state('app.pickups-staging', {
                url: 'pickups_v2?view&page&limit&siteId&zoneId',
                component: 'pickupsStaging'
            })

            .state('app.pickups-dispatched', {
                url: 'pickups_v3?view&page&limit&siteId&zoneId',
                component: 'pickupsDispatched'
            })

            .state('app.pickup-details', {
                url: 'pickup-details?id',
                component: 'pickupDetails'
            })

            .state('pickup-sheet', {
                url: '/pickup-sheet?date&hubId&courierId&vehicleId',
                views: {
                    content: {
                        component: 'pickupSheet'
                    }
                }
            })

            // USERS
            .state('app.couriers', {
                url: 'couriers?page&limit&key&deactivated&site&zone&site_type&site_id&zone_id',
                component: 'couriers'
            })

            .state('app.courier-details', {
                url: 'courier-details?user_id&site_id',
                component: 'courierDetails'
            })

            .state('app.dispatchers', {
                url: 'dispatchers?deactivated&page&limit&search&site_type&site_id',
                component: 'dispatchers'
            })

            .state('app.dispatcher-details', {
                url: 'dispatcher-details?site_id&user_id',
                component: 'dispatcherDetails'
            })

            .state('app.hub-supports', {
                url: 'hub-supports?page&limit&deactivated&hub_id',
                component: 'hubSupports'
            })

            .state('app.hub-support-details', {
                url: 'hub-support-details?&user_id&site_id',
                component: 'hubSupportDetails'
            })

            .state('app.customer-supports', {
                url: 'customer-supports?page&limit&deactivated&site_type&site_id',
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
                url: 'personnels?deactivated&page&limit&search&site_type&site_id',
                component: 'personnels'
            })

            .state('app.personnel-details', {
                url: 'personnel-details?site_id&user_id',
                component: 'personnelDetails'
            })

            //DATA-MANAGEMENT
            .state('app.hubs', {
                url: 'hubs?deactivated&page&limit&keyword',
                component: 'hubs'
            })

            .state('app.hub-details', {
                url: 'hub-details?id',
                component: 'hubDetails'
            })

            .state('app.distribution-centers', {
                url: 'distribution-centers?deactivated&page&limit&keyword&hubId',
                component: 'dcs'
            })

            .state('app.dc-details', {
                url: 'dc-details?id',
                component: 'dcsDetails'
            })

            .state('app.vehicles', {
                url: 'vehicles?deactivated&page&limit&keyword&siteId',
                component: 'vehicles'
            })

            .state('app.vehicle-details', {
                url: 'vehicle-details?id',
                component: 'vehicleDetails'
            })

            .state('app.zones', {
                url: 'zones?siteType&siteFront&siteId&isUnassigned&filterClose&zoom&center_map_lat_lng&deactivated',
                component: 'zones'
            })

            .state('app.bins', {
                url: 'bins?deactivated&page&limit&keyword&siteId',
                component: 'bins'
            })

            .state('app.bin-details', {
                url: 'bin-details?id',
                component: 'binDetails'
            })

            .state('app.packaging-codes', {
                url: 'packaging-codes?deactivated&page&limit&keyword',
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
