const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        company_code: Joi.string().trim().hex().length(24).allow(null),
        house_bank: Joi.string().trim().hex().length(24).allow(null),
        account_id: Joi.string().trim().hex().length(24).allow(null),
        statement_number: Joi.number().integer().allow(null),
        statement_date: Joi.date().allow(null),
        currency: Joi.string().trim().hex().length(24).allow(null),
    },
    control: {
        control: {
            opening_balance: Joi.number().integer().allow(null),
            closing_balance: Joi.number().integer().allow(null),
            posting_date: Joi.date().allow(null),
        },
        selection_of_payment_advices: {
            planning_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
            statement_date: Joi.date().allow(null),
            planning_date_from: Joi.date().allow(null),
            planning_date_to: Joi.date().allow(null),
            characteristic: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        further_processing: {
            bank_posting_only: Joi.boolean().allow(null),
        },
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};