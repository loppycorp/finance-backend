const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        paying_company_code: Joi.string().trim().required().hex().length(24),
        paying_company_code_to: Joi.number().integer().required().allow(null),
        house_bank: Joi.string().trim().required().hex().length(24),
        house_bank_to: Joi.number().integer().required().allow(null),
        account_id: Joi.string().trim().required().hex().length(24),
        account_id_to: Joi.number().integer().required().allow(null),
        payroll_checks: Joi.boolean().allow(null),
    },
    general_selections: {
        general_selections: {
            bank_key: Joi.string().trim().required().hex().length(24).allow(null),
            bank_key_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            bank_account: Joi.number().integer().required().allow(null),
            bank_account_to: Joi.number().integer().required().allow(null),
            check_number: Joi.number().integer().required().allow(null),
            check_number_to: Joi.number().integer().required().allow(null),
            currency: Joi.string().trim().required().hex().length(24).allow(null),
            currency_to: Joi.number().integer().required().allow(null),
            amount: Joi.number().integer().required().allow(null),
            amount_to: Joi.number().integer().required().allow(null),
        },
        output_control: {
            list_of_outstanding_checks: Joi.boolean().allow(null),
            additional_heading: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};