const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        gl_account_code: Joi.number().integer().required(),
        company_code: Joi.string().trim().required().hex().length(24),
    },
    type_description: {
        control_in_chart_of_accounts: {
            account_group: Joi.string().trim().required().hex().length(24),
            statement_account: Joi.boolean().required(),
            balance_sheet_account: Joi.boolean().required(),
        },
        description: {
            short_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            long_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        consolidation_data_in_chart_of_accounts: {
            trading_partner: Joi.string().trim().required().hex().length(24).allow(null),
        }
    },
    control_data: {
        account_control_in_company_code: {
            account_currency: Joi.string().trim().required().hex().length(24).allow(null),
            local_crcy: Joi.boolean().required(),
            exchange_rate: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            valuation_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            tax_category: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            posting_tax_allowed: Joi.boolean().required(),
        },
        account_management_in_company_code: {
            item_mgmt: Joi.boolean().required(),
            line_item: Joi.boolean().required(),
            sort_key: Joi.string().trim().required().hex().length(24).allow(null),
        }
    },
    create_bank_interest: {
        control_of_document_creation_in_company_code: {
            field_status_group: Joi.string().trim().required().hex().length(24),
            post_automatically: Joi.boolean().required(),
        },
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};