const Joi = require('joi');
const ProfitCenter = require('../../models/vendor_pymnt_transc.model');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    vendor_id: Joi.string().trim().required().hex().length(24),
    vendor_code: Joi.number().integer(),
    bank_details: {
        country: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        bank_key: Joi.number().integer().allow(''),
        bank_account: Joi.number().integer().allow(''),
        account_holder: Joi.number().integer().allow(''),
        ck: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        iban_value: Joi.number().integer().allow(''),
        bnkt: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),

    },
    payment_transactions: {
        alternative_payee: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        dme_indicator: Joi.number().integer().allow(''),
        instruction_key: Joi.number().integer().allow(''),
        isr_number: Joi.number().integer().allow(''),

    },
    alternative_payee: {
        individual_spec: Joi.string().trim().required().Boolean(),
        spec_reference: Joi.string().trim().required().Boolean(),
    }
    
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};