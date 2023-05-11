const Joi = require('joi');

const DefaultModel = require('../../models/document_data.model');

const defaultSchema = Joi.object({
    header: Joi.object().keys({
        document_date: Joi.date().required(),
        posting_date: Joi.date().required(),
        reference: Joi.string().trim().required().allow(''),
        doc_header_text: Joi.string().trim().required().allow(''),
        cross_cc_no: Joi.string().trim().required().allow(''),
        company_code: Joi.string().trim().required().hex().max(24),
        currency: Joi.string().trim().required().hex().max(24)
    }),
    items: Joi.array().items(Joi.object().keys({
        gl_account: Joi.string().trim().required().hex().max(24),
        short_text: Joi.string().trim().required(),
        transaction_type: Joi.string().trim().required().valid(DefaultModel.TRANS_TYPE_CREDIT, DefaultModel.TRANS_TYPE_DEBIT),
        amount_in_doc_curr: Joi.number().strict().required(),
        company_code: Joi.string().trim().required().hex().max(24),
        trading_part_ba: Joi.string().trim().required().hex().max(24),
        bussiness_place: Joi.string().trim().required().allow(''),
        partner: Joi.string().trim().required().allow(''),
        cost_center: Joi.string().trim().required().hex().max(24)
    }))
});
module.exports = { validateBodySchema: defaultSchema };