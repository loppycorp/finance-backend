const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    tax_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    jmx1: Joi.number().strict().allow('', null),
    jmop: Joi.number().strict().allow('', null),
    jex1: Joi.number().strict().allow('', null),
    jec1: Joi.number().strict().allow('', null),
    jhx1: Joi.number().strict().allow('', null),
    jse1: Joi.number().strict().allow('', null),
    jvrd: Joi.number().strict().allow('', null),
    smx1: Joi.number().strict().allow('', null),
    jsrt: Joi.number().strict().allow('', null),
    jec3: Joi.number().strict().allow('', null),
    jse3: Joi.number().strict().allow('', null),
    jmx2: Joi.number().strict().allow('', null),
    jmi2: Joi.number().strict().allow('', null),
    jmip: Joi.number().strict().allow('', null),
    jex2: Joi.number().strict().allow('', null),
    jec2: Joi.number().strict().allow('', null),
    jhx2: Joi.number().strict().allow('', null),
    jse2: Joi.number().strict().allow('', null),
    jvrn: Joi.number().strict().allow('', null),
    jipc: Joi.number().strict().allow('', null),
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};