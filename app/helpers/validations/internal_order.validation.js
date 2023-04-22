const Joi = require('joi');
const internal_order = require('../../models/internal_order.model');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
order_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
order:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
controlling_area:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
description:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
assignments:{
    company_code:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    business_area:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    plant:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    functional_area:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    object_class:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    profit_center:Joi.string().trim().required().hex().length(24),
    responsible_cctr:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    user_responsible:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    wbs_element:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    requesting_cctr:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    requesting_co_code:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    requesting_order:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    sales_order:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    external_order_no:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR)
},
control_data:{
  status:{
    system_status:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).valid(
        internal_order.STATUS_CREATED,
        internal_order.STATUS_RELEASE,
        internal_order.STATUS_TECHNICALLY_COMPLETE,
    ),
    user_status:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    status_number:Joi.number().integer().required(),
},
control_data:{
    currency:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    order_category:Joi.number().integer().required(),
    actual_posted_cctr:Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    statistical_order:Joi.boolean().required(),
    plan_integrated_order:Joi.boolean().required(),
    revenue_postings:Joi.boolean().required(),
    commitment_update:Joi.boolean().required(),
}
}
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};