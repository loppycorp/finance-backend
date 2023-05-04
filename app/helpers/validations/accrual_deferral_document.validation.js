const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    document_date: Joi.date().required(),
    posting_date: Joi.date().required(),
    document_number: Joi.number().required(),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    doc_header_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    trading_part_ba: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    period: Joi.number().required(),
    ledger_grp_id: Joi.string().trim().hex().max(24),
    company_code_id: Joi.string().trim().required().hex().max(24),
    currency_rate: Joi.number().required(),
    translatn_date: Joi.date().required(),
    cross_cc_no: Joi.number().required(),
  },
  inverse_posting: {
    reversal_reason: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    reversal_date: Joi.date().required(),
  },
  item: {
    pstky: Joi.number().required(),
    gl_account_id: Joi.string().trim().required().hex().max(24),
    sgl_ind: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    ttype: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  data_entry_view: {
    document_number: Joi.number().required(),
    document_date: Joi.date().required(),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    currency: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    posting_date: Joi.date().required(),
    cross_cc_no: Joi.number().required(),
    fiscal_year: Joi.date().required(),
    period: Joi.number().required(),
    ledger_group_id: Joi.string().trim().hex().max(24),
    texts_exist: Joi.boolean().required(),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
