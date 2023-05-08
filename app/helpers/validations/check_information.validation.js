const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  check: {
    house_bank: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    account_id: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    check_number: Joi.number().required(),
  },
  header: {
    payment_document_no: Joi.number().required(),
    paying_company_code: Joi.string().trim().required().hex().max(24),
    fiscal_year: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    payment_date: Joi.date().required(),
    house_bank: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    account_id: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    check_number: Joi.number().required(),
  },
  issuing_amount: {
    currency: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    amount_paid: Joi.number().required(),
    cash_discount_amount: Joi.number().allow(""),
  },
  address: {
    title: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    payee_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    street: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    city: Joi.boolean().required(),
    country: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    po_box: Joi.number().allow(""),
    po_box_post_cde: Joi.number().allow(""),
    post_code: Joi.number().allow(""),
    regional_code: Joi.number().required(),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
