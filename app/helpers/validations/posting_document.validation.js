const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    company_code_id: Joi.string().trim().required().hex().max(24),
    company_code_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    document_number: Joi.number().required(),
    document_number_to: Joi.number().required(),
    fiscal_year: Joi.date().required(),
    fiscal_year_to: Joi.date().required(),
  },
  general_selections: {
    document_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    document_type_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    posting_date: Joi.date().required(),
    posting_date_to: Joi.date().required(),
    entry_date: Joi.date().required(),
    entry_date_to: Joi.date().required(),
    reference_number: Joi.number().required(),
    reference_number_to: Joi.number().required(),
    reference_transaction: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR),
    reference_transaction_to: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR),
    reference_key: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    reference_key_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    logical_system: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    logical_system_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  further_selection: {
    settlement_period: Joi.date().required(),
    settlement_period_to: Joi.date().required(),
    run_schedule: Joi.date().required(),
    run_schedule_to: Joi.date().required(),
    user: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    user_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  output_control: {
    batch_input_session_name: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR),
    user_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    blocking_date: Joi.date().required(),
    hold_processed_session: Joi.boolean().required(),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
