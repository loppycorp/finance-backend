const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    cost_element: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    controlling_area_id: Joi.string().trim().required().hex().length(24),
    valid_from: Joi.date().required(),
    valid_to: Joi.date().required(),
    names: {
        name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    },
    basic_data: {
        cost_elem_ctgry: Joi.string().trim().required().hex().length(24),
        attribute: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        func_area: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    }
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};