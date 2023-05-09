const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    company: Joi.string().trim().required().hex().max(24),
	gl_account: Joi.string().trim().required().hex().max(24),
	
	amount: Joi.number().strict().required(),
    tax_code: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	calculate_tax: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
    
	bussiness_place: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	
	cost_center: Joi.string().trim().required().hex().max(24),
	order: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	
	wbs_element: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	profit_segment: Joi.string().trim().required().hex().max(24).optional(),
	network: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	
	sales_order: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	
	purchasing_doc: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	quantity: Joi.number().strict().required().optional(),
	
	assignment: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	text: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required().optional(),
	
	ptsky_type: Joi.string().trim().required().hex().max(24).optional(),
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};