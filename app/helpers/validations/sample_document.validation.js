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
    fiscal_year: Joi.date().required(),
    company_code_id: Joi.string().trim().required().hex().max(24),
    currency: Joi.number().required(),
    translatn_date: Joi.date().required(),
  },
  item: {
    pstky: Joi.number().required(),
    gl_account_id: Joi.string().trim().required().hex().max(24),
    sgl_ind: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    ttype: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
