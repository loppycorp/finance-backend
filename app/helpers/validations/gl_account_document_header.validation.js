const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    document_date: Joi.date().required(),
    type: Joi.string().trim().required().hex().max(24),
    company: Joi.string().trim().required().hex().max(24),

    posting_date: Joi.date().required(),
    period: Joi.string().trim().required().hex().max(24).optional(),
    currency: Joi.string().trim().required().hex().max(24),
    currency_rate: Joi.number().strict().required().optional(),

    doc_number: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
    translatn_date: Joi.date().required().optional(),
    reference: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
    cross_cc_no: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),

    doc_header_text: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required(),
    trading_part_ba: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional()
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};