const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    cost_element_code: Joi.number().required(),
    controlling_area_code: Joi.string().trim().required().hex().length(24),
    valid_from: Joi.date().required(),
    valid_to: Joi.date().required(),
  },
  basic_data: {
    names: {
      name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
      description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    },
    basic_data: {
      cost_elem_ctgry: Joi.string().trim().required().hex().length(24),
      attribute: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(""),
      func_area: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(""),
    },
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
