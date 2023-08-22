const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        country_key: Joi.string().trim().hex().length(24).allow('', null),
        tax_code: Joi.string().trim().hex().length(24).allow('', null),
        procedure: Joi.string().trim().hex().length(24).allow('', null),
        tax_type: Joi.string().trim().hex().length(24).allow('', null),
    },
    percentage_rates: {
        item: Joi.array().items(Joi.object({
            tax_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            acct_key: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            tax_percent_rate: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            level: Joi.number().integer().allow(null, ''),
            from_lvl: Joi.number().integer().allow(null, ''),
            cont_type: Joi.number().integer().allow(null, ''),
        })),
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};