const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        paying_company_code: Joi.string().trim().required().hex().length(24),
        house_bank: Joi.string().trim().required().hex().length(24),
        gl_account: Joi.string().trim().required().hex().length(24).allow(null),
    },
    lot: {
        lot_number: Joi.number().integer(),
        cheque_number_from: Joi.number().integer(),
        cheque_number_to: Joi.number().integer(),
    },
    control_data: {
        next_lot_number: Joi.number().integer().allow(null),
        pmnt_meths_list: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        non_sequential: Joi.boolean(),
    },
    additional_information: {
        short_info: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        purchase_date: Joi.date(),
    }
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};