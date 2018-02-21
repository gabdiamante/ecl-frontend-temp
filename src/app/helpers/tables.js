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
                cellTemplate: `<a ui-sref="app.courier-details({ user_id:row.entity.user_id, site_id:row.entity.site_id })">{{COL_FIELD}}</a>`
            },
            { name: 'username', displayName: 'Username' },
            {
                name: 'contact_number',
                displayName: 'Contact',
                cellTemplate: `<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>`
            },
            {
                name: 'zone',
                displayName: 'Zone',
                cellTemplate: `<span ng-bind-html="COL_FIELD | displaynone"></span>`
            },
            { name: 'email', displayName: 'Email' },
            {
                name: 'updated',
                displayName: 'Date Updated',
                cellTemplate: `{{ COL_FIELD | date:short }}`
            },
            {
                name: 'action',
                width: 50,
                displayName: '',
                cellTemplate: `<div ng-include="'template-user-management-courier-action'"></div>`
            }
        ]
    },
    merchants: {
        columnDefs: [
            {
                name: 'fullname',
                displayName: 'Name',
                cellTemplate: `<a ui-sref="app.merchant-details({ id:row.entity.id })">{{COL_FIELD}}</a>`
            },
            // { name: 'username', displayName:'Username' },
            {
                name: 'contact',
                displayName: 'Contact',
                cellTemplate: `<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>`
            },
            { name: 'status', displayName: 'Status' }
        ]
    },
    dispatchers: {
        columnDefs: [
            {
                name: 'name',
                cellTemplate: `<a ui-sref="app.dispatcher-details({ site_id: row.entity.site_id, user_id: row.entity.user_id })" ng-bind="row.entity.first_name + ' ' + row.entity.last_name"></a>`
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
                cellTemplate: `<div ng-include="'template-user-dispatcher-action'"></div>`
            }
        ]
    },
    personnels: {
        columnDefs: [
            {
                name: 'name',
                cellTemplate: `<a ui-sref="app.personnel-details({ id: row.entity.user_id })" ng-bind="row.entity.first_name + ' ' + row.entity.last_name"></a>`
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
                cellTemplate: `<div ng-include="'template-user-personnel-action'"></div>`
            }
        ]
    },
    hub_supports: {
        columnDefs: [
            {
                name: 'fullname',
                displayName: 'Name',
                cellTemplate: `<a ui-sref="app.hub-support-details({ user_id:row.entity.user_id, site_id:row.entity.site_id })">{{COL_FIELD}}</a>`
            },
            { name: 'username', displayName: 'Username' },
            { name: 'email', displayName: 'Email' },
            {
                name: 'updated',
                displayName: 'Date Updated',
                cellTemplate: `{{ COL_FIELD | date:short }}`
            },
            {
                name: 'action',
                width: 50,
                displayName: '',
                cellTemplate: `<div ng-include="'template-user-management-hub-support-action'"></div>`
            }
        ]
    },
    customer_supports: {
        columnDefs: [
            {
                name: 'fullname',
                displayName: 'Name',
                cellTemplate: `<a ui-sref="app.customer-support-details({ user_id:row.entity.user_id, site_id:row.entity.site_id })">{{COL_FIELD}}</a>`
            },
            { name: 'username', displayName: 'Username' },
            { name: 'email', displayName: 'Email' },
            { 
                name: 'contact_number', 
                displayName: 'Contact', 
                cellTemplate:`<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>` 
            },
            {
                name: 'updated',
                displayName: 'Date Updated',
                cellTemplate: `{{ COL_FIELD | date:short }}`
            },
            {
                name: 'action',
                width: 50,
                displayName: '',
                cellTemplate: `<div ng-include="'template-user-management-customer-support-action'"></div>`
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
                cellTemplate: `<div ng-include="'template-data-management-hub-action'"></div>`
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
                cellTemplate: `<div ng-include="'template-data-management-dcs-action'"></div>`
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
                cellTemplate: `<div ng-include="'template-data-management-vehicle-action'"></div>`
            }
        ]
    },
    bins: {
        columnDefs: [
            {
                name: 'code',
                cellTemplate: `<a ui-sref="app.bin-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'name' },
            { name: 'volume' },
            { name: 'weight' },
            { name: 'dimension' },
            {
                name: 'updated',
                displayName: 'Date',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            },
            {
                name: 'action',
                displayName: ' ',
                cellTemplate: `<div ng-include="'template-data-management-bin-action'"></div>`
            }
        ]
    },
    packaging_codes: {
        columnDefs: [
            {
                name: 'code',
                cellTemplate: `<a ui-sref="app.packaging-code-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'name' },
            { name: 'volume' },
            { name: 'weight' },
            { name: 'dimension' },
            {
                name: 'updated',
                displayName: 'Date',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            },
            {
                name: 'action',
                displayName: ' ',
                cellTemplate: `<div ng-include="'template-data-management-packaging-code-action'"></div>`
            }
        ]
    },
    //
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
    },
    delivery_staging: {
        columnDefs: [
            {
                name: 'airway_bill',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            { name: 'cneeAddress', displayName: 'CNEE ADDRESS' },
            {
                name: 'datePickup',
                displayName: 'REASON',
                cellTemplate: `<span ng-bind="datePickup || vm.date | date:short"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />'
            }
        ]
    },
    delivery_dispatched: {
        columnDefs: [
            {
                name: 'airway_bill',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            { name: 'cneeAddress', displayName: 'CNEE ADDRESS' },
            {
                name: 'datePickup',
                displayName: 'REASON',
                cellTemplate: `<span ng-bind="datePickup || vm.date | date:short"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />'
            }
        ]
    },
    pickup_bad_address: {
        columnDefs: [
            {
                name: 'booking_code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            {
                name: 'shipperAddress',
                displayName: 'SHPR ADDRESS',
                cellTemplate: `<span ng-bind="COL_FIELD"></span>&nbsp;<i class="fa fa-pencil"></i>`
            },
            {
                name: 'reason',
                displayName: 'REASON',
                cellTemplate: `<span ng-bind="COL_FIELD | date:short"></span>`
            },
            {
                name: 'shipperContactNumber',
                displayName: 'CONTACT',
                cellTemplate: `<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>`
            }
        ]
    },
    pickup_staging: {
        columnDefs: [
            {
                name: 'booking_code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'shipperAddress', displayName: 'SHPR ADDRESS' },
            {
                name: 'shipperContactNumber',
                displayName: 'CONTACT',
                cellTemplate: `<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />'
            }
        ]
    },
    pickup_dispatched: {
        columnDefs: [
            {
                name: 'booking_code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id:COL_FIELD })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'shipperAddress', displayName: 'SHPR ADDRESS' },
            {
                name: 'status',
                displayName: 'STATUS',
                cellTemplate: `<span ng-bind="COL_FIELD | displaynone"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />'
            }
        ]
    },
    //HISTORY
    history: {
        columnDefs: [
            {
                name: 'code',
                width: 50,
                cellTemplate: `<a ui-sref="app.hub-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'shipperName', displayName: 'Shpr' },
            {
                name: 'shipperAddress',
                displayName: 'Shpr Address'
            },
            {
                name: 'cneeName',
                displayName: 'Cnee'
            },
            {
                name: 'cneeAddress',
                displayName: 'Cnee Address'
            },
            {
                name: 'updated',
                displayName: 'Date Updated',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            }
        ]
    }
};

export default TABLES;
