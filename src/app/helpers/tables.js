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
    }
};

export default TABLES;
