const TABLES = {
    users: {
        columnDefs: [
            {
                width: 50,
                headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`,
                cellTemplate:
                    '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />'
            },
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
                name: 'name',
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
    //DATA-MANAGEMENT
    hubs: {
        columnDefs: [
            {
                name: 'code',
                cellTemplate: `<a ui-sref="app.hub-details({ id: row.entity.id })">{{COL_FIELD}}</a>`
            },
            { name: 'name' },
            {
                name: 'address',
                cellTemplate: `<span ng-bind="COL_FIELD | titlecase"></span>`
            },
            {
                name: 'updatedAt',
                displayName: 'Date',
                cellTemplate: `{{ COL_FIELD | date:short}}`
            }
        ]
    },
    courier_deliveries : {
        columnDefs : [
            { name: 'airway_bill', displayName: 'AWB CODE', cellTemplate:`<a ui-sref="row.entity.id">{{COL_FIELD}}</a>` },
            { name: 'shipper', displayName: 'SHPR' },
            { name: 'consignee', displayName: 'CNEE' },
            { name: 'status', displayName: 'STATUS', cellTemplate:`<span ng-class="{'label label-success':COL_FIELD=='successful', 'label label-danger':COL_FIELD=='failed' }" ng-bind="COL_FIELD"></span>` }, 
            { name: 'checkin', displayName: 'CHECK IN', cellTemplate:`{{ COL_FIELD | date:'HH:mm' }}` }, 
            { name: 'checkout', displayName: 'CHECK OUT', cellTemplate:`{{ COL_FIELD | date:'HH:mm' }}` } 
        ]
    },
    courier_pickups : {
        columnDefs : [
            { name: 'booking_code', displayName: 'BOOKING CODE', cellTemplate:`<a ui-sref="row.entity.id">{{COL_FIELD}}</a>` },
            { name: 'shipper', displayName: 'SHPR' },
            { name: 'consignee', displayName: 'CNEE' },
            { name: 'status', displayName: 'STATUS', cellTemplate:`<span ng-class="{'label label-success':COL_FIELD=='successful', 'label label-danger':COL_FIELD=='failed' }" ng-bind="COL_FIELD"></span>` }, 
            { name: 'checkin', displayName: 'CHECK IN', cellTemplate:`{{ COL_FIELD | date:'hh:mm' }}` }, 
            { name: 'checkout', displayName: 'CHECK OUT', cellTemplate:`{{ COL_FIELD | date:'hh:mm' }}` } 
        ]
    }
};

export default TABLES;
