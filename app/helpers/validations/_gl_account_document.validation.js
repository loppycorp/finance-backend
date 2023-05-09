const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  basic_data: {
    document_date: Joi.date().required(),
    posting_date: Joi.date().required(),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    doc_header_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    cross_cc_no: Joi.number().required(),
    company_code_id: Joi.string().trim().required().hex().max(24),
    currency: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
});

module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
