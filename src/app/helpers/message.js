var CATEGORIES = {
    alerts: {
        save_success: 'You saved the category.',
        delete_success: 'You deleted the category.',
        save_failed: 'Failed to save category.'
    },
    modals: {
        confirm_delete_header: 'Delete Category',
        confirm_delete_message: 'Are you sure you want to delete this category?'
    }
};

var ATTRIBUTES = {
    alerts: {
        save_success: 'You saved the attribute set.',
        save_failed: 'Failed to save attribute set.',
        delete_success: 'You deleted the attribute set'
    }
};

var PERMISSIONS = {
    alerts: str => {
        return {
            save_success: 'You saved the ' + str + '.',
            save_failed: 'Failed to save the ' + str + '.',
            delete_success: 'You deleted the ' + str + '.',
            wrong_password:
                'You have entered an invalid password for current user.'
        };
    }
};

var NOTIFICATIONS = {
    alerts: {
        marked_success: 'The message has been marked as Read.',
        delete_success: 'The message has been removed.'
    },
    modals: {
        confirm_delete_header: 'Delete Notification',
        confirm_delete_message: 'Are you sure?'
    }
};

var PASSWORD = {
    minlength: 'Your password should contain at least 6 characters.',
    passwordChars: [
        'at least 6 characters long',
        'at least one uppercase letter',
        'at least one number',
        'at least one special character ($,@,*,etc)'
    ]
};
var MSG = {
    SUCCESS: {
        address: 'Successfully added address.',
        editAddress: 'Successfully udpated address',
        checkout: 'Your order has been received',
        invoiceComment: 'Successfully added invoice comment',
        catalogrule: 'Successfully added catalog price rule',
        updateCatalogRule: 'Successfully updated catalog price rule'
    },
    ERROR: {
        errorUpdate: 'Unable to update '
    }
};
