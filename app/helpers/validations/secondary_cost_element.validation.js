const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    cost_element: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    controlling_area_id: Joi.string().trim().required().hex().length(24),
    valid_from:  Joi.date().required(),
    valid_to: Joi.date().required(),
    Names:{
        name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    },
    Basic_Data:{
        cost_elem_ctgry: Joi.number().integer().required(),
        attribute: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        func_area: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    }
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};