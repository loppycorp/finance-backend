const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
        vendor: Joi.string().trim().required().hex().length(24),
        company_code: Joi.string().trim().required().hex().length(24),
        wh_tax_country: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    },
    with_tax_information: {
        wth_t_ty: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        w_tax_c: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        w_tax: Joi.boolean().required().allow(''),
        oblig_form: Joi.date().required().allow(''),
        oblig_to: Joi.date().required().allow(''),
        w_tax_number: Joi.number().required().allow(''),
        name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow('')
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};