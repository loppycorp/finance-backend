const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  fiscal_period: {
    period: Joi.number().required(),
    name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};