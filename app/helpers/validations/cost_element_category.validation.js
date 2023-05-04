const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 255;

const defaultSchema = Joi.object({
    code: Joi.number().required(),
    name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};