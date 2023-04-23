const i18next = require('i18next');

i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: {
            translation: {
                global: {
                    err: {
                        validation_failed: 'Validation failed!',
                        an_error_occured: 'An error occured while processing the request!'
                    }
                },
                user: {
                    suc: {
                        create: 'Successfully created user record!',
                        read: 'Successfully fetched user record!',
                        update: 'Successfully updated user record!',
                        delete: 'Successfully deleted user record!',
                        search: 'Successfully fetched user records!',
                    },
                    err: {
                        create: 'Failed to ceate user record!',
                        read: 'The user record doesn\'t exists!',
                        update: 'Failed to update user record!',
                        delete: 'Failed to delete user record!',
                        search: 'No records found!',
                        not_exists: 'The user record doesn\'t exists!'
                    }
                },
                department: {
                    suc: {
                        create: 'Successfully created department record!',
                        read: 'Successfully fetched department record!',
                        update: 'Successfully updated department record!',
                        delete: 'Successfully deleted department record!',
                        search: 'Successfully fetched department records!',
                    },
                    err: {
                        create: 'Failed to ceate department record!',
                        read: 'The department record doesn\'t exists!',
                        update: 'Failed to update department record!',
                        delete: 'Failed to delete department record!',
                        search: 'No records found!',
                        not_exists: 'The department record doesn\'t exists!'
                    }
                },
                ctrling_area: {
                    suc: {
                        create: 'Successfully created controlling area record!',
                        read: 'Successfully fetched controlling area record!',
                        update: 'Successfully updated controlling area record!',
                        delete: 'Successfully deleted controlling area record!',
                        search: 'Successfully fetched controlling area records!',
                    },
                    err: {
                        create: 'Failed to ceate controlling area record!',
                        read: 'The controlling area record doesn\'t exists!',
                        update: 'Failed to update controlling area record!',
                        delete: 'Failed to delete controlling area record!',
                        search: 'No records found!',
                        not_exists: 'The  controlling area record doesn\'t exists!'
                    }
                },
                segment: {
                    suc: {
                        create: 'Successfully created segment record!',
                        read: 'Successfully fetched segment record!',
                        update: 'Successfully updated segment record!',
                        delete: 'Successfully deleted segment record!',
                        search: 'Successfully fetched segment records!',
                    },
                    err: {
                        create: 'Failed to ceate segment record!',
                        read: 'The segment record doesn\'t exists!',
                        update: 'Failed to update segment record!',
                        delete: 'Failed to delete segment record!',
                        search: 'No records found!',
                        not_exists: 'The segment record doesn\'t exists!'
                    }
                },
                profit_center: {
                    suc: {
                        create: 'Successfully created profit-center record!',
                        read: 'Successfully fetched profit-center record!',
                        update: 'Successfully updated profit-center record!',
                        delete: 'Successfully deleted profit-center record!',
                        search: 'Successfully fetched profit-center records!',
                    },
                    err: {
                        create: 'Failed to ceate profit-center record!',
                        read: 'The profit center record doesn\'t exists!',
                        update: 'Failed to update profit-center record!',
                        delete: 'Failed to delete profit-center record!',
                        search: 'No records found!',
                        not_exists_user: 'User responsible doesn\'t exists!',
                        not_exists_per: 'Person responsible doesn\'t exists!'
                    }
                },
                profit_ctr_group: {
                    suc: {
                        create: 'Successfully created profit-center group record!',
                        read: 'Successfully fetched profit-center group record!',
                        update: 'Successfully updated profit-center group record!',
                        delete: 'Successfully deleted profit-center group record!',
                        search: 'Successfully fetched profit-center group records!',
                    },
                    err: {
                        create: 'Failed to ceate profit-center group record!',
                        read: 'The profit-center group record doesn\'t exists!',
                        update: 'Failed to update profit-center group record!',
                        delete: 'Failed to delete profit-center group record!',
                        search: 'No records found!',
                        not_exists: 'The profit-center group record doesn\'t exists!'
                    }
                },
                company: {
                    suc: {
                        create: 'Successfully created company record!',
                        read: 'Successfully fetched company record!',
                        update: 'Successfully updated company record!',
                        delete: 'Successfully deleted company record!',
                        search: 'Successfully fetched company records!',
                    },
                    err: {
                        create: 'Failed to ceate company record!',
                        read: 'Thecompany record doesn\'t exists!',
                        update: 'Failed to update company record!',
                        delete: 'Failed to delete company record!',
                        search: 'No records found!',
                        not_exists: 'The company record doesn\'t exists!'
                    }
                },
                cost_center_category: {
                    suc: {
                        create: 'Successfully created cost-center category record!',
                        read: 'Successfully fetched cost-center category record!',
                        update: 'Successfully updated cost-center category record!',
                        delete: 'Successfully deleted cost-center category record!',
                        search: 'Successfully fetched cost-center category records!',
                    },
                    err: {
                        create: 'Failed to ceate cost-center category record!',
                        read: 'The departmcost-center categoryent record doesn\'t exists!',
                        update: 'Failed to update cost-center category record!',
                        delete: 'Failed to delete cost-center category record!',
                        search: 'No records found!',
                        not_exists: 'The cost-center category record doesn\'t exists!'
                    }
                },
                hierarcy_area: {
                    suc: {
                        create: 'Successfully created hierarcy area record!',
                        read: 'Successfully fetched hierarcy area record!',
                        update: 'Successfully updated hierarcy area record!',
                        delete: 'Successfully deleted hierarcy area record!',
                        search: 'Successfully fetched hierarcy area records!',
                    },
                    err: {
                        create: 'Failed to ceatehierarcy area record!',
                        read: 'The hierarcy area record doesn\'t exists!',
                        update: 'Failed to update hierarcy area record!',
                        delete: 'Failed to delete hierarcy area record!',
                        search: 'No records found!',
                        not_exists: 'The hierarcy area record doesn\'t exists!'
                    }
                },
                currency: {
                    suc: {
                        create: 'Successfully created currency record!',
                        read: 'Successfully fetched currency record!',
                        update: 'Successfully updated currency record!',
                        delete: 'Successfully deleted currency record!',
                        search: 'Successfully fetched currency records!',
                    },
                    err: {
                        create: 'Failed to create currency record!',
                        read: 'The currency record doesn\'t exists!',
                        update: 'Failed to update  record!',
                        delete: 'Failed to delete currency record!',
                        search: 'No records found!',
                        not_exists: 'The currency area record doesn\'t exists!'
                    }
                },
                cost_center: {
                    suc: {
                        create: 'Successfully created cost-center record!',
                        read: 'Successfully fetched cost-center record!',
                        update: 'Successfully updated cost-center record!',
                        delete: 'Successfully deleted cost-center record!',
                        search: 'Successfully fetched cost-center records!',
                    },
                    err: {
                        create: 'Failed to create cost-center record!',
                        read: 'The cost-center record doesn\'t exists!',
                        update: 'Failed to update  record!',
                        delete: 'Failed to delete cost-center record!',
                        search: 'No records found!',
                        not_exists: 'The cost-center area record doesn\'t exists!'
                    }
                },
            },
        }
    }
});

module.exports = i18next;