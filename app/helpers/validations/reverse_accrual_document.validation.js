const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  company_code_id: Joi.string().trim().required().hex().length(24),
  company_code_id_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  document_number: Joi.number().integer().required(),
  document_number_to: Joi.number().integer().required(),
  fiscal_year: Joi.date().required(),
  fiscal_year_to: Joi.date().required(),
  document_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  document_type_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  ledger_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  ledger_group_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  general_selections: {
    posting_date: Joi.date().required(),
    posting_date_to: Joi.date().required(),
    entry_date: Joi.date().required(),
    entry_date_to: Joi.date().required(),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    reference_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  further_selections: {
    reverse_posting_date: Joi.date().required(),
    reverse_posting_date_to: Joi.date().required(),
    user_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    user_name_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  reverse_posting_details: {
    posting_period: Joi.date().required(),
    reversal_reason: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    test_run: Joi.boolean().required(),
  },
  cross_company_code_transactions: {
    do_not_process: Joi.boolean().required(),
    process: Joi.boolean().required(),
    relevant_docs_if_possible: Joi.boolean().required(),
    only_reverse_completely: Joi.boolean().required(),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
