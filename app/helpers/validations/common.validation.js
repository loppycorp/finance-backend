const Joi = require('joi');

const paramsSchema = Joi.object({
    id: Joi.string().hex().length(24),
    item_id: Joi.string().hex().length(24).optional()
});

module.exports = {
    paramsSchema,
    validateParamsSchema: paramsSchema
};