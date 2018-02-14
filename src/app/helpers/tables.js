const TABLES = {
    users: {
        columnDefs: [
            // {
            //     width: 50,
            //     headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`,
            //     cellTemplate:
            //         '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />'
            // },
            { name: 'id', displayName: 'ID', width: 50 },
            {
                name: 'avatar',
                displayName: 'Avatar',
                cellTemplate: `<div class="img-con"><img class="img-res" ng-src="{{COL_FIELD}}"></div>`,
                width: 75
            },
            { name: 'fullname', displayName: 'Name' }
        ],
        filter_fields: []
    },
    //USERS
    couriers: {
        columnDefs: [
            {
                name: 'fullname',
                displayName: 'Name',
                cellTemplate: `<a ui-sref="row.entity.id">{{COL_FIELD}}</a>`
            },
            { name: 'contact', displayName: 'Contact' },
            { name: 'zone', displayName: 'Zone' },
            {
                name: 'vehicle',
                displayName: 'Assigned Vehicle',
                cellTemplate: `<a ui-sref="row.entity.vehicle">{{COL_FIELD}}</a>`
            },
            {
                name: 'updatedAt',
                displayName: 'Date Updated',
                cellTemplate: `{{ COL_FIELD | date:short }}`
            }
        ]
    },
    dispatchers: {
        columnDefs: [
            {
                name: 'name',
                cellTemplate: `<a ui-sref="app.dispatcher-details({ id: row.entity.id })" ng-bind="row.entity.first_name + ' ' + row.entity.last_name"></a>`
            },
            { name: 'username' },
            { name: 'email' },
            {
                name: 'updated',
                displayName: 'Date',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            },
            {
                name: 'action',
                displayName: ' ',
                cellTemplate: `<div class="btn-group pull-right" uib-dropdown dropdown-append-to-body>
                                <a id="btn-append-to-body" type="button" class="text-grey btn btn-trans pd-0-10" uib-dropdown-toggle>
                                    <i class="fa fa-ellipsis-v"></i>
                                </a>
                                <ul ng-if="vm.deleted != 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ui-sref="app.dispatcher-details({ id: row.entity.id })">
                                            <i class="fa fa-info-circle"></i> &nbsp;Details
                                        </a>
                                    </li>
                                    <li role="menuitem" >
                                        <a ng-click="vm.handleUpdateItem(row.entity)">
                                            <i class="fa fa-edit"></i> &nbsp;Update
                                        </a>
                                    </li> 
                                    <li class="divider" ></li>
                                    <li role="menuitem">
                                        <a ng-click="vm.handleDeactivateItem(row.entity)">
                                            <i class="fa fa-ban"></i>
                                            Deactivate
                                        </a>
                                    </li> 
                                </ul>
                                <ul ng-if="vm.deleted == 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ng-click="vm.handleReactivateItem(row.entity)">
                                            <i class="fa fa-edit"></i>
                                            Reactivate
                                        </a>
                                    </li> 
                                </ul>
                            </div>`
            }
        ]
    },
    //DATA-MANAGEMENT
    hubs: {
        columnDefs: [
            {
                name: 'code',
                cellTemplate: `<a ui-sref="app.hub-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'name' },
            {
                name: 'address'
            },
            {
                name: 'updated',
                displayName: 'Date Updated',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            },
            {
                name: 'action',
                displayName: ' ',
                cellTemplate: `<div class="btn-group pull-right" uib-dropdown dropdown-append-to-body>
                                <a id="btn-append-to-body" type="button" class="text-grey btn btn-trans pd-0-10" uib-dropdown-toggle>
                                    <i class="fa fa-ellipsis-v"></i>
                                </a>
                                <ul ng-if="vm.deleted != 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ui-sref="app.hub-details({ id: row.entity.id })">
                                            <i class="fa fa-info-circle"></i> &nbsp;Details
                                        </a>
                                    </li>
                                    <li role="menuitem" >
                                        <a ng-click="vm.handleUpdateItem(row.entity)">
                                            <i class="fa fa-edit"></i> &nbsp;Update
                                        </a>
                                    </li> 
                                    <li class="divider" ></li>
                                    <li role="menuitem">
                                        <a ng-click="vm.handleDeactivateItem(row.entity)">
                                            <i class="fa fa-ban"></i>
                                            Deactivate
                                        </a>
                                    </li> 
                                </ul>
                                <ul ng-if="vm.deleted == 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ng-click="vm.handleReactivateItem(row.entity)">
                                            <i class="fa fa-edit"></i>
                                            Reactivate
                                        </a>
                                    </li> 
                                </ul>
                            </div>`
            }
        ]
    },
    distribution_centers: {
        columnDefs: [
            {
                name: 'code',
                cellTemplate: `<a ui-sref="app.dc-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'name' },
            {
                name: 'address'
            },
            {
                name: 'hub_code',
                displayName: 'Hub'
            },
            {
                name: 'zone_code',
                displayName: 'Zone'
            },
            {
                name: 'action',
                displayName: ' ',
                cellTemplate: `<div class="btn-group pull-right" uib-dropdown dropdown-append-to-body>
                                <a id="btn-append-to-body" type="button" class="text-grey btn btn-trans pd-0-10" uib-dropdown-toggle>
                                    <i class="fa fa-ellipsis-v"></i>
                                </a>
                                <ul ng-if="vm.deleted != 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ui-sref="app.dc-details({ id: row.entity.id })">
                                            <i class="fa fa-info-circle"></i> &nbsp;Details
                                        </a>
                                    </li>
                                    <li role="menuitem" >
                                        <a ng-click="vm.handleUpdateItem(row.entity)">
                                            <i class="fa fa-edit"></i> &nbsp;Update
                                        </a>
                                    </li> 
                                    <li class="divider" ></li>
                                    <li role="menuitem">
                                        <a ng-click="vm.handleDeactivateItem(row.entity)">
                                            <i class="fa fa-ban"></i>
                                            Deactivate
                                        </a>
                                    </li> 
                                </ul>
                                <ul ng-if="vm.deleted == 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ng-click="vm.handleReactivateItem(row.entity)">
                                            <i class="fa fa-edit"></i>
                                            Reactivate
                                        </a>
                                    </li> 
                                </ul>
                            </div>`
            }
        ]
    },
    vehicles: {
        columnDefs: [
            {
                name: 'plate_number',
                cellTemplate: `<a ui-sref="app.vehicle-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'model' },
            { name: 'max_weight' },
            { name: 'max_volume' },
            {
                name: 'updated',
                displayName: 'Date',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            },
            {
                name: 'action',
                displayName: ' ',
                cellTemplate: `<div class="btn-group pull-right" uib-dropdown dropdown-append-to-body>
                                <a id="btn-append-to-body" type="button" class="text-grey btn btn-trans pd-0-10" uib-dropdown-toggle>
                                    <i class="fa fa-ellipsis-v"></i>
                                </a>
                                <ul ng-if="vm.deleted != 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ui-sref="app.vehicle-details({ id: row.entity.id })">
                                            <i class="fa fa-info-circle"></i> &nbsp;Details
                                        </a>
                                    </li>
                                    <li role="menuitem" >
                                        <a ng-click="vm.handleUpdateItem(row.entity)">
                                            <i class="fa fa-edit"></i> &nbsp;Update
                                        </a>
                                    </li> 
                                    <li class="divider" ></li>
                                    <li role="menuitem">
                                        <a ng-click="vm.handleDeactivateItem(row.entity)">
                                            <i class="fa fa-ban"></i>
                                            Deactivate
                                        </a>
                                    </li> 
                                </ul>
                                <ul ng-if="vm.deleted == 'true'" class="dropdown-menu dropdown-menu-right" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-body" >
                                    <li role="menuitem">
                                        <a ng-click="vm.handleReactivateItem(row.entity)">
                                            <i class="fa fa-edit"></i>
                                            Reactivate
                                        </a>
                                    </li> 
                                </ul>
                            </div>`
            }
        ]
    },
    courier_deliveries: {
        columnDefs: [
            {
                name: 'airway_bill',
                displayName: 'AWB CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            {
                name: 'status',
                displayName: 'STATUS',
                cellTemplate: `<span ng-class="{'label label-success':COL_FIELD=='successful', 'label label-danger':COL_FIELD=='failed' }" ng-bind="COL_FIELD"></span>`
            },
            {
                name: 'checkin',
                displayName: 'CHECK IN',
                cellTemplate: `{{ COL_FIELD | date:'HH:mm' }}`
            },
            {
                name: 'checkout',
                displayName: 'CHECK OUT',
                cellTemplate: `{{ COL_FIELD | date:'HH:mm' }}`
            }
        ]
    },
    courier_pickups: {
        columnDefs: [
            {
                name: 'booking_code',
                displayName: 'BOOKING CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            {
                name: 'status',
                displayName: 'STATUS',
                cellTemplate: `<span ng-class="{'label label-success':COL_FIELD=='successful', 'label label-danger':COL_FIELD=='failed' }" ng-bind="COL_FIELD"></span>`
            },
            {
                name: 'checkin',
                displayName: 'CHECK IN',
                cellTemplate: `{{ COL_FIELD | date:'hh:mm' }}`
            },
            {
                name: 'checkout',
                displayName: 'CHECK OUT',
                cellTemplate: `{{ COL_FIELD | date:'hh:mm' }}`
            }
        ]
    },
    delivery_bad_address: {
        columnDefs: [
            {
                name: 'airway_bill',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            {
                name: 'cneeAddress',
                displayName: 'CNEE ADDRESS',
                cellTemplate: `<span ng-bind="COL_FIELD"></span>&nbsp;<i class="fa fa-pencil"></i>`
            },
            {
                name: 'reason',
                displayName: 'REASON',
                cellTemplate: `<span ng-bind="COL_FIELD | date:short"></span>`
            }
        ]
    }
};

export default TABLES;
