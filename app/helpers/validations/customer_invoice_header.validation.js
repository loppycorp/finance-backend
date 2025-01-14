const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header_data: {
    document_date: Joi.date().required(),
    posting_date: Joi.date().required(),
    document_number: Joi.number().required().allow(""),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(""),
    doc_header_text: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR)
      .allow(""),
    trading_part_ba: Joi.string()
      .trim()
      .required()
      .max(LIMIT_DEFAULT_CHAR)
      .allow(""),
    type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    period: Joi.string().trim().required().hex().max(24),
    company_code_id: Joi.string().trim().required().hex().max(24),
    currency_rate: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    translatn_date: Joi.date().required().allow(""),
    cross_cc_no: Joi.number().required().allow(""),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
