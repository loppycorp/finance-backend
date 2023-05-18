const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        account_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    },
    general_data: {
        meaning: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        one_time_account: Joi.boolean().required().allow(''),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};