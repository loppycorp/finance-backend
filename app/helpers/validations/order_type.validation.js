const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT = 4;

const defaultSchema = Joi.object({
  order_type: {
    type: Joi.string().trim().required().max(LIMIT_DEFAULT),
    code: Joi.number().required(),
    name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
