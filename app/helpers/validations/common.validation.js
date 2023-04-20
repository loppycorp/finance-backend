const Joi = require('joi');

const paramsSchema = Joi.object({
    id: Joi.string().hex().length(24)
});

module.exports = {
    paramsSchema
};