const Joi = require('joi');

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

    },
    alternative_payee: {
        individual_spec: Joi.boolean().required(),
        spec_reference: Joi.boolean().required(),
    }

});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};