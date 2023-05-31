const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    desc: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow('')
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};