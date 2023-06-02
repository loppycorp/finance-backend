const Joi = require('joi');

const DefaultModel = require('../../models/invoice.model');

const defaultSchema = Joi.object({
    header: Joi.object().keys({
        vendor: Joi.string().trim().required().hex().max(24),
        invoice_date: Joi.date().required(),
        posting_date: Joi.date().required(),
        document_type: Joi.string().trim().required().hex().max(24),
        company_code: Joi.string().trim().required().hex().max(24),
        cross_cc_no: Joi.string().trim().allow(''),
        amount: Joi.number().allow(''),
        tax_amount: Joi.number().allow(''),
        business_place: Joi.number().allow(''),
        section: Joi.number().allow(''),
        text: Joi.string().trim().allow(''),
        sgl_ind: Joi.string().trim().allow(''),
        reference: Joi.string().trim().allow(''),
        currency: Joi.string().trim().required().hex().max(24),
        calculate_tax: Joi.boolean(),
    }),
    items: {
        items: Joi.array().items(Joi.object().keys({
            gl_account: Joi.string().trim().required().hex().max(24),
            transaction_type: Joi.string().trim().hex().max(24).allow(null),
            amount: Joi.number().required(),
            trading_part_ba: Joi.string().trim().hex().max(24).allow(null),
            segment: Joi.string().trim().hex().max(24).allow(null),
            cost_center: Joi.string().trim().hex().max(24).required(),
            tax: Joi.string().trim().allow(''),
        })),
    },
    type: {
        invoice_code: Joi.string().trim()
            .valid(DefaultModel.DOC_TYPE_VENDOR, DefaultModel.DOC_TYPE_CUSTOMER),
        invoice_status: Joi.string().trim()
            .valid(DefaultModel.DOC_STATUS_HOLD, DefaultModel.DOC_STATUS_COMPLETED, DefaultModel.DOC_STATUS_PARKED),


    },

});
module.exports = { validateBodySchema: defaultSchema };