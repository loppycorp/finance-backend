const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        charts_of_account: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        account_group: Joi.number().required().max(4),
        name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        from_account: Joi.number().required(),
        to_account: Joi.number().required(),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};