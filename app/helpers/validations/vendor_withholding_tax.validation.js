const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    vendor_id: Joi.string().trim().required().hex().length(24),
    company_code_id: Joi.string().trim().required().hex().length(24),
    wh_tax_country: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    with_tax_information: {
        wth_t_ty: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        w_tax_c: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        liable: Joi.boolean(),
        rec_ty: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        w_tax_id: Joi.number().integer().allow(''),
        exemption_number: Joi.number().integer().allow(''),
        exem: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        exmpt_r: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        exempt_form: Joi.date().required().allow(''),
        exempt_to: Joi.date().required().allow(''),
        description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};