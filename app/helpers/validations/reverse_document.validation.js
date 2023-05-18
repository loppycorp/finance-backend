const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  document_details: {
    document_number: Joi.number().integer().required(),
    company_code: Joi.string().trim().required().hex().length(24),
    fiscal_year: Joi.date().required(),
  },
  specifications: {
    reversal_reason: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    posting_date: Joi.date().required(),
    posting_period: Joi.date().required().allow(''),
  },
  check_management_spec: {
    void_reason_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
