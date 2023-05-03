const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_L = 100;

const defaultSchema = Joi.object({
    cost_center_code: Joi.number().required(),
    controlling_area_id: Joi.string().trim().required().hex().max(24),
    valid_range: {
        from: Joi.date().required(),
        to: Joi.date().required(),
    },
    names: {
        name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        desc: Joi.string().trim().max(LIMIT_DEFAULT_CHAR_L),
    },
    basic_data: {
        user_responsible_id: Joi.string().trim().required().hex().max(24).allow(''),
        person_responsible: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        department_id: Joi.string().trim().required().hex().max(24).allow('', null),
        cost_ctr_category_id: Joi.string().trim().required().hex().max(24).allow('', null),
        hierarchy_area_id: Joi.string().trim().required().hex().max(24).allow('', null),
        company_id: Joi.string().trim().required().hex().max(24).allow('', null),
        business_area: Joi.number().strict().required(),
        functional_area: Joi.number().strict().required(),
        currency_id: Joi.string().trim().required().allow(''),
        profit_center_id: Joi.string().trim().required().hex().max(24),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};