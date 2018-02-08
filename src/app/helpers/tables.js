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
    }
};

export default TABLES;
