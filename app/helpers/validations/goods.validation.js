const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        document_number: Joi.number().allow('', null),
        document_date: Joi.date().allow('', null),
        reference: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        currency: Joi.string().trim().hex().max(24).allow('', null),
        company_code: Joi.string().trim().hex().max(24).allow('', null),
        posting_date: Joi.date().allow('', null),
        cross_cc_no: Joi.number().allow('', null),
        fiscal_year: Joi.string().trim().hex().max(24).allow('', null),
        period: Joi.string().trim().hex().max(24).allow('', null, ''),
        ledger_group: Joi.string().trim().hex().max(24).allow('', null, ''),
    },
    item: {
        item: Joi.array().items(Joi.object({
            company_code: Joi.string().trim().hex().max(24).allow(null, ''),
            posting_key: Joi.string().trim().hex().max(24).allow(null, ''),
            s: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(null, ''),
            account: Joi.string().trim().hex().max(24).allow('', null),
            description: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            amount: Joi.number().allow(null, ''),
            currency: Joi.string().trim().hex().max(24).allow(null, ''),
            tax: Joi.number().allow(null, ''),
            cost_center: Joi.string().trim().hex().max(24).allow(null, ''),
            profit_center: Joi.string().trim().hex().max(24).allow(null, ''),
            segment: Joi.string().trim().hex().max(24).allow(null, ''),
        })),
    },

});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};