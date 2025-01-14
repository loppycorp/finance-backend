const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    company_code: Joi.string().trim().required().hex().length(24),
    house_bank_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    bank_country: Joi.string().trim().required().hex().length(24).allow(null),
    bank_key_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  address: {
    name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(""),
    region: Joi.number().integer().allow(""),
    street: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(""),
    city: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(""),
    bank_branch: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR)
      .allow(""),
  },
  control_data: {
    swift_code: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR)
      .allow(""),
    bank_group: Joi.string().trim().required().hex().length(24).allow(null),
    postbank_account: Joi.boolean(),
    bank_number: Joi.number().integer().allow(""),
  },
});

const authSchema = Joi.object({
  username: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  password: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
  authSchema,
};
