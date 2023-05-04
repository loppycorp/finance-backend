const Joi = require("joi");

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  reference: {
    document_number: Joi.number().required(),
    company_code_id: Joi.string().trim().required().hex().max(24),
    fiscal_year: Joi.date().required(),
  },
  flow_control: {
    generate_reverse: Joi.boolean().required(),
    enter_gl_acc_itm: Joi.boolean().required(),
    do_not_propose_amounts: Joi.boolean().required(),
    recalculate_days: Joi.boolean().required(),
    display: Joi.boolean().required(),
    copy_text: Joi.boolean().required(),
    transfer: Joi.boolean().required(),
    recalculate_local: Joi.boolean().required(),
    copy_segment: Joi.boolean().required(),
  },
  header: {
    document_date: Joi.date().required(),
    posting_date: Joi.date().required(),
    document_number: Joi.number().required(),
    reference: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    doc_header_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    trading_part_ba: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    period: Joi.number().required(),
    company_code_id: Joi.string().trim().required().hex().max(24),
    currency_rate: Joi.number().required(),
    translatn_date: Joi.date().required(),
    cross_cc_no: Joi.number().required(),
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
