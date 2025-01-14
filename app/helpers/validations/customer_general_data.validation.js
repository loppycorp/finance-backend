const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
        customer_code: Joi.number().integer(),
        company_code: Joi.string().trim().hex().length(24),
        account_group: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
    },
    address: {
        name: {
            title: Joi.string().trim().max(LIMIT_DEFAULT_CHAR_LONG),
            name: Joi.string().trim().max(LIMIT_DEFAULT_CHAR_LONG),
        },
        search_terms: {
            search_term_1: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
            search_term_2: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        street_address: {
            street: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            house_number: Joi.number().integer().allow(''),
            postal_code: Joi.number().integer().allow(''),
            city: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            country: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
            region: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        po_box_address: {
            po_box: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            postal_code: Joi.number().integer().allow(''),
            company_postal_code: Joi.number().integer().allow(''),
        },
        communication: {
            language: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
            telephone: Joi.number().integer().allow(''),
            mobile_phone: Joi.number().integer().allow(''),
            fax: Joi.number().integer().allow(''),
            email: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },
    control_data: {
        account_control: {
            customer: Joi.string().trim().hex().length(24).allow('', null),
            trading_partner: Joi.string().trim().hex().length(24).allow('', null),
            authorization: Joi.string().trim().hex().length(24).allow('', null),
            corporate_group: Joi.string().trim().hex().length(24).allow('', null),
        },
        reference_data: {
            location_one: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            location_two: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            check_digit: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            industry: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },
    payment_transactions: {
        bank_details: Joi.array().items(Joi.object({
            country: Joi.string().trim().hex().length(24).allow(null),
            bank_key: Joi.string().trim().hex().length(24).allow(null),
            bank_account: Joi.number().integer().allow(''),
            account_holder: Joi.number().integer().allow(''),
            ck: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            iban_value: Joi.number().integer().allow(''),
            bnkt: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            reference: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        })),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};