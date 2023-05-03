const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  company_code_id: Joi.string().trim().required().hex().max(24),
  recurring_entry_run: {
    first_run_on: Joi.date().required(),
    last_run_on: Joi.date().required(),
    interval_in_months: Joi.number().required(),
    run_date: Joi.date().required(),
    run_schedule: Joi.date().required(),
    transfer_amounts: Joi.boolean().required(),
    transfer_tax_amouns: Joi.boolean().required(),
  },
  document_header_information: {
    document_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    document_header_text: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR),
    trading_part_ba: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    currency_rate: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    translatn_date: Joi.date().required(),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
