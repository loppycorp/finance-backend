const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        document_number: Joi.number().integer().required(),
        company_code: Joi.string().trim().required().hex().length(24),
        fiscal_year: Joi.string().trim().required().hex().length(24),
    },
    items: {
        payment_method_and_form_specifications: {
            payment_method: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            check_lot_number: Joi.number().integer().required().allow(null),
            alternative_form: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            padding_character: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        output_control: {
            printer_for_forms: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            pmnt_advice_printer: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            print_immediately: Joi.boolean().allow(null),
            recipients_lang: Joi.boolean().allow(null),
            currency_in_iso_code: Joi.boolean().allow(null),
            test_printout: Joi.boolean().allow(null),
            do_not_void_any_checks: Joi.boolean().allow(null),
        }
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};