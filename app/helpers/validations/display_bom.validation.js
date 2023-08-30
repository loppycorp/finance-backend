const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        material: Joi.string().trim().hex().max(24).allow('', null),
        plant: Joi.string().trim().hex().max(24).allow('', null),
        alternative_bom: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
    },
    items: {
        items: Joi.array().items(Joi.object({
            ict: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            component: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            conponent_description: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            quantity: Joi.number().allow('', null),
            un: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            as: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            sis: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            valid_from: Joi.date().allow('', null),
            valid_to: Joi.date().allow('', null),
        })),
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
