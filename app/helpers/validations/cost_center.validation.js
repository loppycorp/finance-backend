const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_L = 100;

const defaultSchema = Joi.object({
    header: {
        cost_center_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        controlling_area: Joi.string().trim().required().hex().max(24),
        valid_range: {
            from: Joi.date().required(),
            to: Joi.date().required(),
        },
    },
    basic_data: {
        names: {
            name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            description: Joi.string().trim().max(LIMIT_DEFAULT_CHAR_L).allow(''),
        },
        basic_data: {
            user_responsible: Joi.string().trim().hex().max(24).allow('', null),
            person_responsible: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            department: Joi.string().trim().required().hex().max(24).allow('', null),
            cost_ctr_category: Joi.string().trim().hex().max(24).allow('', null),
            hierarchy_area: Joi.string().trim().hex().max(24).allow('', null),
            company: Joi.string().trim().required().hex().max(24),
            business_area: Joi.number().required().allow(''),
            functional_area: Joi.number().allow(''),
            currency: Joi.string().trim().required().hex().max(24),
            profit_center: Joi.string().trim().hex().max(24).allow(null),
        },
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};