const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    document_date: Joi.date().required(),
    posting_date: Joi.date().required(),
    document_number: Joi.number().required().allow(''),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    doc_header_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    trading_part_ba: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    period: Joi.number().required(),
    ledger_group: Joi.string().trim().hex().max(24).allow('', null),
    company_code: Joi.string().trim().required().hex().max(24),
    currency_rate: Joi.number().required(),
    translatn_date: Joi.date().required().allow(''),
    cross_cc_no: Joi.number().required().allow(''),
  },
  inverse_posting: {
    reversal_reason: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    reversal_date: Joi.date().required(),
  },
  item: {
    pstky: Joi.string().trim().required().hex().max(24),
    account: Joi.string().trim().required().hex().max(24),
    sgl_ind: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    ttype: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
  },
  data_entry_view: {
    document_number: Joi.number().required(),
    document_date: Joi.date().required(),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
    currency: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    posting_date: Joi.date().required(),
    cross_cc_no: Joi.number().required().allow(''),
    fiscal_year: Joi.date().required(),
    period: Joi.number().required(),
    ledger_group: Joi.string().trim().hex().max(24).allow('', null),
    texts_exist: Joi.boolean().required(),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
