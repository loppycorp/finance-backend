const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        company_code: Joi.string().trim().hex().length(24).allow('', null),
        customer: Joi.string().trim().hex().length(24).allow('', null),
        vendor: Joi.string().trim().hex().length(24).allow('', null),
        oi_key_date: Joi.date().allow(null),
    },
    general_selections: {
        general_selections: {
            correspondence: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            correspondence_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            company_code: Joi.string().trim().hex().length(24).allow('', null),
            company_code_to: Joi.string().trim().hex().length(24).allow('', null),
            account_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            account_type_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            open_item_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            open_item_account_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            document_number: Joi.number().integer().allow(null, ''),
            document_number_to: Joi.number().integer().allow(null, ''),
            fiscal_year: Joi.string().trim().hex().length(24).allow('', null),
            fiscal_year_to: Joi.string().trim().hex().length(24).allow('', null),
            user: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            user_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            date_of_request: Joi.date().allow(null),
            date_of_request_to: Joi.date().allow(null),
            time_of_request: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            time_of_request_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            print_date: Joi.date().allow(null),
            print_date_to: Joi.date().allow(null),
            cash_journal_number: Joi.number().integer().allow(null, ''),
            cash_journal_number_to: Joi.number().integer().allow(null, ''),
        },
    },
    further_selections: {
        further_selections: {
            entries_without_print_date: Joi.boolean().allow(null),
            entries_with_print_date: Joi.boolean().allow(null),
        },
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};