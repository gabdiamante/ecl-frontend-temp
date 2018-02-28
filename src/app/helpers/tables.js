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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.courier-details({ user_id:row.entity.user_id, site_id:row.entity.site_id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.merchant-details({ id:row.entity.id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.dispatcher-details({ site_id: row.entity.site_id, user_id: row.entity.user_id })" ng-bind="row.entity.first_name + ' ' + row.entity.last_name"></a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.personnel-details({ site_id:row.entity.site_id, user_id: row.entity.user_id })" ng-bind="row.entity.first_name + ' ' + row.entity.last_name"></a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.hub-support-details({ user_id:row.entity.user_id, site_id:row.entity.site_id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.customer-support-details({ user_id:row.entity.user_id, site_id:row.entity.site_id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.hub-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.dc-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.vehicle-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.bin-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
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
                cellTemplate: `<a ui-sref-if condition="vm.activated" value="app.packaging-code-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'name' },
            { name: 'volume' },
            { name: 'weight', displayName: 'Weight (kg)' },
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
    //DELIVERIES
    courier_deliveries: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'AWB CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:row.entity.id })" ng-bind="COL_FIELD"></a>`
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
    delivery_bad_address: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id: row.entity.id })" ng-bind="COL_FIELD"></a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            {
                name: 'cneeAddress',
                displayName: 'CNEE ADDRESS',
                cellTemplate: `<span ng-bind="COL_FIELD"></span>&nbsp;
                                <div class="pull-right ng-scope">
                                    <ul class="list list-inline">
                                        <li title="Update Address">
                                            <i class="fa text-grey fa-lg fa-pencil" ng-class="{ 'fa-pencil': !isEdit, 'fa-times' : isEdit }" ng-click="vm.viewMap(row.entity, $index)">
                                            </i>
                                        </li>
                                    </ul>
                                </div>`
            },
            {
                name: 'reason',
                displayName: 'REASON',
                cellTemplate: `<span ng-bind="COL_FIELD"></span>`
            },
            {
                name: 'datePickup',
                displayName: 'PICKUP DATE',
                cellTemplate: `<span ng-bind="ct.parseDate(datePickup) | date:short"></span>`
            }
        ]
    },
    delivery_staging: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:row.entity.id })" ng-bind="COL_FIELD"></a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'cneeName', displayName: 'CNEE' },
            { name: 'cneeAddress', displayName: 'CNEE ADDRESS' },
            {
                name: 'datePickup',
                displayName: 'PICKUP DATE',
                cellTemplate: `<span ng-bind="ct.parseDate(datePickup) | date:short"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="ct.toggleCheckBox(vm.checkbox,'checkItems', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.checkItems" checklist-value="row.entity" type="checkbox" />'
            }
        ]
    },
    delivery_dispatched: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'AWB CODE',
                cellTemplate: `<a ui-sref="app.delivery-details({ id:row.entity.id })" ng-bind="COL_FIELD"></a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'shipperAddress', displayName: 'SHPR ADDRESS' },
            {
                name: 'status', displayName: 'STATUS',
                cellTemplate: `<span ng-class="{'label label-success':COL_FIELD=='successful', 'label label-danger':COL_FIELD=='failed' }" ng-bind="COL_FIELD | titlecase"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox[index]" ng-change="ct.toggleCheckBox(vm.checkbox[index],'checkItems[{{index}}]', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.checkItems[index]" checklist-value="row.entity" type="checkbox" />'
            }
        ]
    },
    //PICKUPS
    courier_pickups: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'BOOKING CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id:row.entity.id })" ng-bind="COL_FIELD"></a>`
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
    pickup_bad_address: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id: row.entity.id })" ng-bind="COL_FIELD"></a>`
            },
            { name: 'shipper_name', displayName: 'SHPR' },
            {
                name: 'shipper_address',
                displayName: 'SHPR ADDRESS',
                cellTemplate: `<span ng-bind="COL_FIELD"></span>&nbsp;
                <div class="pull-right ng-scope">
                    <ul class="list list-inline">
                        <li title="Update Address">
                            <i class="fa text-grey fa-lg fa-pencil" ng-class="{ 'fa-pencil': !isEdit, 'fa-times' : isEdit }" ng-click="vm.viewMap(row.entity, $index)">
                            </i>
                        </li>
                    </ul>
                </div>`
            },
            {
                name: 'bad_address_reason',
                displayName: 'REASON',
                cellTemplate: `<span ng-bind-html="COL_FIELD | displaynone"></span>`
            },
            {
                name: 'shipper_contact_number',
                displayName: 'CONTACT',
                cellTemplate: `<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>`
            }
        ]
    },
    pickup_staging: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id: row.entity.id })" ng-bind="COL_FIELD"></a>`
            },
            { name: 'shipper_name', displayName: 'SHPR' },
            { name: 'shipper_address', displayName: 'SHPR ADDRESS' },
            {
                name: 'shipper_contact_number',
                displayName: 'CONTACT',
                cellTemplate: `<span ng-bind-html="COL_FIELD | handlePccDisplay : '+63'"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="ct.toggleCheckBox(vm.checkbox,'checkItems', 'id')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.checkItems" checklist-value="row.entity.id" type="checkbox" />'
            }
        ]
    },
    pickup_dispatched: {
        columnDefs: [
            {
                name: 'code',
                displayName: 'CODE',
                cellTemplate: `<a ui-sref="app.pickup-details({ id: row.entity.id })" ng-bind="COL_FIELD"></a>`
            },
            { name: 'shipperName', displayName: 'SHPR' },
            { name: 'shipperAddress', displayName: 'SHPR ADDRESS' },
            {
                name: 'status',
                displayName: 'STATUS',
                cellTemplate: `<span ng-class="{'label label-success':COL_FIELD=='successful', 'label label-danger':COL_FIELD=='failed' }" ng-bind="COL_FIELD"></span>`
            },
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox[index]" ng-change="ct.toggleCheckBox(vm.checkbox[index],'checkItems[{{index}}]','id')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.checkItems[index]" checklist-value="row.entity.id" type="checkbox" />'
            }
        ]
    },
    //HISTORY
    history: {
        columnDefs: [
            {
                name: 'code',
                width: 50,
                cellTemplate: `<a ui-sref="app.hub-details({ id: row.entity.id })" ng-bind="COL_FIELD"></a>`
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
