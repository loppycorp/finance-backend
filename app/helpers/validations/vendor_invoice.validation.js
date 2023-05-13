const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
        vendor: Joi.string().trim().required().hex().length(24),
        company_code: Joi.string().trim().required().hex().length(24),
        gl_account: Joi.string().trim().required().hex().length(24),
    },
    item: {
        title: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        name: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        language_key: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        street: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        po_box: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        po_without_no: Joi.boolean().allow(''),
        po_box_pcode: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        city: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        country: Joi.string().trim().required().hex().length(24).max(LIMIT_DEFAULT_CHAR_LONG),
        postal_code: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        region: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        bank_key: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        bank_account: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        reference: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        back_country: Joi.string().required().max(LIMIT_DEFAULT_CHAR_LONG),
        control_key: Joi.string().required().max(LIMIT_DEFAULT_CHAR_LONG),
        instruction_key: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        dme_indicator: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        tax_type: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        tax_number_type: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        tax_number1: Joi.number().allow(''),
        tax_number2: Joi.number().allow(''),
        tax_number3: Joi.number().allow(''),
        tax_number4: Joi.number().allow(''),
        type_of_business: Joi.string().allow(''),
        type_of_industr: Joi.string().allow(''),
        natural_person: Joi.boolean().allow(''),
        equalizatn_tax: Joi.boolean().allow(''),
        liable_for_vat: Joi.boolean().allow(''),
        reps_name: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};