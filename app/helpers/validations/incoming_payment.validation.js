const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
        document_date: Joi.date().required(),
        posting_date: Joi.date().required(),
        document_number: Joi.number().required().allow(''),
        reference: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        doc_header_text: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        clearing_text: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        trading_part_ba: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        type: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        period: Joi.number().required(),
        company_code: Joi.string().trim().hex().length(24).allow('', null),
        currency_rate: Joi.number().required(),
        translatn_date: Joi.date().required(),
        cross_cc_no: Joi.number().required().allow(''),
    },
    bank_data: {
        account: Joi.number().required(),
        amount: Joi.number().required(),
        bank_charges: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        value_date: Joi.date().required(),
        text: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        business_area: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        amount_lc: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        lc_bank_charges: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        profit_center: Joi.string().trim().hex().length(24).allow('', null),
        assignment: Joi.number().required(),
    },
    open_item_selection: {
        account: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        account_type: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        special_gl: Joi.string().allow('').max(LIMIT_DEFAULT_CHAR_LONG),
        pmnt_advice_no: Joi.string().max(LIMIT_DEFAULT_CHAR_LONG),
        distribute_by_age: Joi.boolean().required().allow(''),
        automatic_search: Joi.boolean().required().allow(''),
        other_accounts: Joi.boolean().required().allow(''),
        standard_ols: Joi.boolean().required().allow(''),
    },
    additional_selections: {
        none: Joi.boolean().required().allow(''),
        amount: Joi.boolean().required().allow(''),
        number: Joi.boolean().required().allow('')
    }
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};