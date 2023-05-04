const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_CHAR = 2;

const defaultSchema = Joi.object({
  document_type: {
    description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    document_type_code: Joi.string().trim().required().max(LIMIT_CHAR),
    reverse_type: Joi.string().trim().max(LIMIT_CHAR).allow(""),
    account_types: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(""),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
