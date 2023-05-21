const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  posting_key_code: Joi.number().required(),
  name: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(""),
  type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(""),

});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
