const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header_data: {
    document_date: Joi.date().required(),
    posting_date: Joi.date().required(),
    document_number: Joi.number().allow(""),
    reference: Joi.string().trim().allow("").max(LIMIT_DEFAULT_CHAR),
    doc_header_text: Joi.string().trim().allow("").max(LIMIT_DEFAULT_CHAR),
    clearing_text: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(""),
    type: Joi.string().trim().required().hex().max(24),
    period: Joi.string().trim().required().hex().max(24),
    company_code_id: Joi.string().trim().required().hex().max(24),
    currency_rate: Joi.string().trim().allow("").max(LIMIT_DEFAULT_CHAR),
    translatn_date: Joi.date().allow(""),
    cross_cc_no: Joi.number().allow(""),
  },
  transaction_processed: {
    outgoing_payment: Joi.boolean().required(),
    incoming_payment: Joi.boolean().required(),
    credit_memo: Joi.boolean().required(),
    transfer_posting_with_clearing: Joi.boolean().required(),
  },

  line_item: {
    pstky: Joi.string().trim().required().hex().max(24),
    account: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    sgl_ind: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    ttype: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(""),
    new_co_code: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(""),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
