const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    cheque_id: Joi.string().trim().hex().length(24),
    cheque_lot: Joi.number().strict().required('',null),
    cheque_number: Joi.number().strict().required('',null),
    is_used: Joi.boolean(),
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};