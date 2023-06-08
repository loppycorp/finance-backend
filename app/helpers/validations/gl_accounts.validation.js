const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        gl_account_code: Joi.number().integer().required(),
        company_code: Joi.string().trim().required().hex().length(24),
    },
    type_description: {
        control_in_chart_of_accounts: {
            account_group: Joi.string().trim().required().hex().length(24).allow(null),
            statement_account: Joi.boolean(),
            balance_sheet_account: Joi.boolean(),
        },
        description: {
            short_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            long_text: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        consolidation_data_in_chart_of_accounts: {
            trading_partner: Joi.string().trim().hex().length(24).allow(null),
        }
    },
    control_data: {
        account_control_in_company_code: {
            account_currency: Joi.string().trim().hex().length(24).allow(null),
            local_crcy: Joi.boolean(),
            exchange_rate: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            valuation_group: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            tax_category: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            posting_tax_allowed: Joi.boolean(),
        },
        account_management_in_company_code: {
            item_mgmt: Joi.boolean(),
            line_item: Joi.boolean(),
            sort_key: Joi.string().trim().hex().length(24).allow(null),
        }
    },
    create_bank_interest: {
        control_of_document_creation_in_company_code: {
            field_status_group: Joi.string().trim().hex().length(24).allow(null),
            post_automatically: Joi.boolean(),
        },
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};