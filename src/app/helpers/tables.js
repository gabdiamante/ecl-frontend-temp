const TABLES = {
    users : {
        columnDefs : [
            { width: 75, headerCellTemplate: `<input type="checkbox" ng-model="vm.checkbox" ng-change="vm.toggleCheckRoleUserAll(vm.checkbox,'roleUserCheck', '')">`, 
            cellTemplate: '<input checklist-model="vm.items.roleUserCheck" checklist-value="row.entity" type="checkbox" />' },
            { name: 'id', displayName: 'ID', width: 75 },
            { name: 'fullname', displayName: 'Name' } 
        ],
        filter_fields : []
    }
};

export default TABLES;