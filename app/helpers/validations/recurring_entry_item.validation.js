const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  recurring_header_id: Joi.string().trim().required().hex().max(24),
  first_line_item: {
    pstky: Joi.number().required(),
    gl_account_id: Joi.string().trim().required().hex().max(24),
    sgl_ind: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    ttype: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  },
  item: {
    amount: Joi.number().required(),
    tax_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    business_place: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    calculate_tax: Joi.boolean().required(),
    cost_center_id: Joi.string().trim().required().hex().max(24),
    wbs_element: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    network: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    order: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    profit_segment: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    sales_order: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    purchasing_doc: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    assignment: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    quantity: Joi.number().required(),
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema,
};
