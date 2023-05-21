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
        reversal_reason: Joi.string().trim().required().hex().max(24).allow(null),
        reversal_date: Joi.date().allow(''),
        ledger_group: Joi.string().trim().required().hex().max(24).allow('', null),
        type: Joi.string().trim().required().hex().max(24).allow(null),
        translatn_date: Joi.date().allow(''),
        fiscal_year: Joi.date().allow(''),
        period: Joi.string().trim().required().hex().max(24).allow(null),
    }),
    items: Joi.array().items(Joi.object().keys({
        gl_account: Joi.string().trim().required().hex().max(24),
        transaction_type: Joi.string().trim().required().valid(DefaultModel.TRANS_TYPE_CREDIT, DefaultModel.TRANS_TYPE_DEBIT),
        amount: Joi.number().required(),
        company_code: Joi.string().trim().required().hex().max(24),
        trading_part_ba: Joi.string().trim().required().hex().max(24),
        bussiness_place: Joi.string().trim().required().allow(''),
        partner: Joi.string().trim().required().allow(''),
        cost_center: Joi.string().trim().required().hex().max(24),
        //added from accrual document
        tax: Joi.number().allow(''),
        profit_center: Joi.string().trim().required().hex().max(24).allow(null),
        segment: Joi.string().trim().required().hex().max(24).allow(null),
    })),
    type: {
        document_code: Joi.string().trim()
            .valid(DefaultModel.DOC_TYPE_GL_ACCOUNT, DefaultModel.DOC_TYPE_SAMPLE_DOCUMENT, DefaultModel.DOC_TYPE_POST_DOCUMENT, DefaultModel.DOC_TYPE_ACCRUAL_DEFERRAL),
        document_status: Joi.string().trim()
            .valid(DefaultModel.DOC_STATUS_HOLD, DefaultModel.DOC_STATUS_COMPLETED, DefaultModel.DOC_STATUS_PARKED),


    },

});
module.exports = { validateBodySchema: defaultSchema };