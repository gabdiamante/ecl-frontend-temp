import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';
import MESSAGE from 'Helpers/message';
import CONSTANTS from 'Helpers/constants';


(function() {
    'use strict';

    angular.module('app').component('personnels', {
        template: require('./personnels.html'),
        controller: PersonnelsCtrl,
        controllerAs: 'vm'
    });

    PersonnelsCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PersonnelsCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.title = 'Personnel';
        vm.titleHeader = vm.title + 's';
        vm.route_name = 'personnel';

        vm.TPLS = 'personnelFormModal';

        vm.deactivated = $stateParams.deactivated == 'true' ? 1 : 0;
        vm.activated = +!vm.deactivated;

        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';
        vm.site_types = CONSTANTS.site_types;
        vm.site_type = $stateParams.site_type || vm.site_types[0].code;
        vm.site_type = $stateParams.site_type || 'HUB';
        vm.site_id = $stateParams.site_id;

        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.loading = false;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: false,
            tableSearch: true,
            tableDeactivate: true
        };

        vm.option_table.columnDefs = TABLES.personnels.columnDefs;
        vm.option_table.data = [];

        vm.goTo = goTo;
        vm.trClick = trClick;

        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleActivation = handleActivation; 
        vm.selectSiteFiltered = selectSiteFiltered;
        vm.getData = getData;

        getData();
        getSites();

        function getSites() {
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '99999',
                    page: '1',
                    type: vm.site_type,
                    is_active: 1
                },
                hasFile: false,
                route: { site: '' },
                cache: true,
                cache_string: 'sites'
            };

            QueryService
                .query(request)
                .then(function (response) {
                    vm.sites = response.data.data.items;
                },
                function (error) {
                    logger.errorFormatResponse(error);
                    //logger.error(MESSAGE.error, err, '');
                });
        }

        function getData(key) {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    site_id: vm.site_id,
                    keyword: key,
                    is_active: vm.activated
                },
                hasFile: false,
                route: { [vm.route_name + 's']: '' },
                cache: false,
                cache_string: vm.route_name
            };

            QueryService.query(request)
                .then(
                    function(response) { 
                        vm.option_table.data = response.data.data.items;
                        vm.pagination.total = response.data.data.total;
                        vm.pagination.page = $stateParams.page || '1';
                        vm.pagination.limit = $stateParams.limit || '10';
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handlePostItem() {
            var modal = {
                title: vm.title,
                titleHeader: 'Add ' + vm.title,
                method: 'add'
            };

            var request = {
                method: 'POST',
                body: {},
                params: false,
                hasFile: false,
                route: { [vm.route_name]: '' }
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (!response) return;
                    response.updated = new Date();
                    vm.option_table.data.unshift(response);
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function handleUpdateItem(data) {
            var modal = {
                title: vm.title,
                titleHeader: 'Edit ' + vm.title,
                method: 'edit',
                route_name: vm.route_name
            };

            var request = {
                method: 'PUT',
                body: data,
                params: false,
                hasFile: false,
                route: { site:data.site_id, [vm.route_name]:data.user_id }
            };

            ModalService.form_modal(request, modal, vm.TPLS).then(
                function(response) {
                    if (!response) return;
                    response.updated = new Date();
                    vm.option_table.data[vm.option_table.data.indexOf(data)] = response; 
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        function handleActivation (data, action) {
            var content = {
                header: action+' '+vm.title,
                message: MESSAGE.confirmMsg(action, vm.title.toLowerCase()),
                prop: data.first_name+' '+(data.middle_name+' '||'')+data.last_name
            };

            ModalService
                .confirm_modal(content)
                .then(
                    function (response) {
                        if (!response) return; 
                        activateDeactivateDeletePersonnel(data, action);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
        }

        function activateDeactivateDeletePersonnel (data, action) {
            var request = {
                method: action == 'delete' ? 'DELETE' : 'PUT',
                body: {},
                params: false,
                hasFile: false,
                route: { site:data.site_id, [vm.route_name]:data.user_id } 
            };
            if (action != 'delete') request.route[action] = '';

            QueryService
                .query(request)
                .then( 
                    function (response) { 
                        logger.success(MESSAGE.loggerSuccess(vm.title, '', action+'d'));
                        vm.option_table.data.splice(
                            vm.option_table.data.indexOf(
                                $filter('filter')(vm.option_table.data, { user_id:data.user_id })[0]
                            ), 1);
                    },
                    function (error) {
                        logger.error(MESSAGE.loggerFailed(vm.title, '', action));
                        logger.errorFormatResponse(error);
                    }
                );
        } 

        function selectSiteFiltered(site_type, site_id, zone_id) {
            goTo({ site_type: site_type, site_id: site_id });
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }

        function trClick(data) {
            $state.go('app.dispatcher-details', { id: data.id });
        }
    }
})();
