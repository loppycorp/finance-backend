const Joi = require('joi');
const ProfitCenter = require('../../models/vendor.model');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    vendor_code: Joi.number().integer(),
    company_code: Joi.string().trim().required().hex().length(24),
    account_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
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
        email: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR.allow('')),
    },
    account_control: {
        customer: Joi.string().trim().required().hex().length(24).allow(''),
        trading_partner: Joi.string().trim().required().hex().length(24).allow(''),
        authorization: Joi.string().trim().required().hex().length(24).allow(''),
        corporate_group: Joi.string().trim().required().hex().length(24).allow(''),
    }
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};