const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        document_number: Joi.number().allow(''),
        document_date: Joi.date().allow(null),
        reference: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(null),
        currency: Joi.string().trim().hex().max(24).allow(null),
        company_code: Joi.string().trim().hex().max(24).allow(null),
        posting_date: Joi.date().allow(null),
        cross_cc_no: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(null),
        fiscal_year: Joi.string().trim().hex().max(24).allow(null),
        ledger: Joi.string().trim().hex().max(24).allow(null),
    },
    items: {
        items:
        {
            company: Joi.string().trim().hex().max(24).allow(null),
            pk: Joi.string().trim().hex().max(24).allow(null),
            account: Joi.string().trim().hex().max(24).allow(null),
            amount: Joi.number().allow(''),
            currency: Joi.string().trim().hex().max(24).allow(null),
            tax: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(null),
            profit_center: Joi.string().trim().hex().max(24).allow(null),
            segment: Joi.string().trim().hex().max(24).allow(null),
        }
    },

});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};