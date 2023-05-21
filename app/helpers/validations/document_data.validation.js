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
        currency: Joi.string().trim().required().hex().max(24),
        //added from accrual document
        reversal_reason: Joi.string().trim().required().hex().max(24).allow('', null),
        // reversal_date: Joi.date().required().allow(''),
        ledger_group: Joi.string().trim().required().hex().max(24).allow('', null),
        // type: Joi.string().trim().required().allow(''),
        // translatn_date: Joi.date().required().allow(''),
        // fiscal_year: Joi.date().required().allow(''),
        // period: Joi.number().required().allow(''),
        // texts_exist: Joi.boolean().required().allow(''),
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
        cost_center: Joi.string().trim().required().hex().max(24),
        //added from accrual document
        // item: Joi.number().required().allow(''),
        pk: Joi.string().trim().required().hex().max(24).allow('', null),
        // s: Joi.string().trim().required().allow(''),
        // description: Joi.string().trim().required().allow(''),
        // amount: Joi.number().required().allow(''),
        curr: Joi.string().trim().required().hex().max(24).allow('', null),
        // tx: Joi.string().trim().required().allow(''),
        profit_center: Joi.string().trim().required().hex().max(24).allow('', null),
        segment: Joi.string().trim().required().hex().max(24).allow('', null),
    })),
    type: {
        document_code: Joi.string().trim()
            .valid(DefaultModel.DOC_TYPE_GL_ACCOUNT, DefaultModel.DOC_TYPE_SAMPLE_DOCUMENT, DefaultModel.DOC_TYPE_POST_DOCUMENT),
        document_status: Joi.string().trim()
            .valid(DefaultModel.DOC_STATUS_HOLD, DefaultModel.DOC_STATUS_COMPLETED, DefaultModel.DOC_STATUS_PARKED),


    },

});
module.exports = { validateBodySchema: defaultSchema };