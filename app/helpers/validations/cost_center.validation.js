const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_L = 100;

const defaultSchema = Joi.object({
    code: Joi.number().strict().required(),
    controlling_area_id: Joi.string().trim().required().hex().max(24),
    valid_range: {
        from:  Joi.date().required(),
        to: Joi.date().required(),
    },
    names: {
        name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        desc: Joi.string().trim().max(LIMIT_DEFAULT_CHAR_L),
    },
    basic_data: {
        user_responsible_id: Joi.string().trim().required().hex().max(24),
        person_responsible_id: Joi.string().trim().required().hex().max(24),
        department_id: Joi.string().trim().required().hex().max(24),
        cost_ctr_category_id: Joi.string().trim().required().hex().max(24),
        hierarchy_area_id: Joi.string().trim().required().hex().max(24),
        company_id: Joi.string().trim().required().hex().max(24),
        business_area: Joi.number().strict().required(),
        functional_area: Joi.number().strict().required(),
        currency_id:  Joi.string().trim().required(),
        profit_center_id: Joi.string().trim().required().hex().max(24),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};