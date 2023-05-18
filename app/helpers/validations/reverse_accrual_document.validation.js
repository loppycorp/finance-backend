const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    company_code: Joi.string().trim().required().hex().length(24),
    company_code_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    document_number: Joi.number().integer().required().allow(''),
    document_number_to: Joi.number().integer().required().allow(''),
    fiscal_year: Joi.date().required().allow(''),
    fiscal_year_to: Joi.date().required().allow(''),
    document_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    document_type_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    ledger_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    ledger_group_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
  },
  general_selections: {
    posting_date: Joi.date().required().allow(''),
    posting_date_to: Joi.date().required().allow(''),
    entry_date: Joi.date().required().allow(''),
    entry_date_to: Joi.date().required().allow(''),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    reference_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
  },
  further_selections: {
    reverse_posting_date: Joi.date().required().allow(''),
    reverse_posting_date_to: Joi.date().required().allow(''),
    user_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    user_name_to: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
  },
  reverse_posting_details: {
    posting_period: Joi.date().required().allow(''),
    reversal_reason: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
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
