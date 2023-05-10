const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
<<<<<<< HEAD:app/helpers/validations/vendor.validation.js
        vendor_code: Joi.number().integer().allow(''),
        company_code: Joi.string().trim().required().hex().length(24),
        account_group: Joi.string().trim().required().hex().length(24),
=======
        vendor_code: Joi.number().integer(),
        company_code: Joi.string().trim().required().hex().length(24),
        account_group: Joi.string().trim().required().hex().length(24).allow(null),

>>>>>>> 4cf72324528aafa6dd9a20e47d7c6587ab534ed8:app/helpers/validations/vendor_general_data.validation.js
    },
    address: {
        name: {
            title: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR_LONG),
            name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR_LONG),
        },
        search_terms: {
            search_term_1: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            search_term_2: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        street_address: {
            street: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            house_number: Joi.number().integer().allow(''),
            postal_code: Joi.number().integer().allow(''),
            city: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            country: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            region: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        po_box_address: {
            po_box: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            postal_code: Joi.number().integer().allow(''),
            company_postal_code: Joi.number().integer().allow(''),
        },
        communication: {
            language: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            telephone: Joi.number().integer().allow(''),
            mobile_phone: Joi.number().integer().allow(''),
            fax: Joi.number().integer().allow(''),
            email: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },
    control_data: {
        account_control: {
            customer: Joi.string().trim().hex().length(24).allow('', null),
            trading_partner: Joi.string().trim().hex().length(24).allow('', null),
            authorization: Joi.string().trim().hex().length(24).allow('', null),
            corporate_group: Joi.string().trim().hex().length(24).allow('', null),
        },
    },
    payment_transactions: {
        bank_details: Joi.array().items(Joi.object({
            country: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            bank_key: Joi.number().integer().allow(''),
            bank_account: Joi.number().integer().allow(''),
            account_holder: Joi.number().integer().allow(''),
            ck: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            iban_value: Joi.number().integer().allow(''),
            bnkt: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        })),
        payment_transactions: {
            alternative_payee: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            dme_indicator: Joi.number().integer().allow(''),
            instruction_key: Joi.number().integer().allow(''),
            isr_number: Joi.number().integer().allow(''),

        },
        alternative_payee: {
            individual_spec: Joi.boolean().required(),
            spec_reference: Joi.boolean().required(),
        },
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};