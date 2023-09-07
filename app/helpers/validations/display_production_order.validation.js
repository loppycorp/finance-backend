const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        order: Joi.string().trim().hex().max(24).allow('', null),
        material: Joi.string().trim().hex().max(24).allow('', null),
        status: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
    },
    general: {
        quantities: {
            total_qty: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            delivered: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            scrap_portion: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            expect_yield_var: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
        basic_dates: {
            finish: Joi.date().allow('', null),
            start: Joi.date().allow('', null),
            release: Joi.date().allow('', null),
        },
        scheduled: {
            finish: Joi.date().allow('', null),
            start: Joi.date().allow('', null),
            release: Joi.date().allow('', null),
        },
        confirmd: {
            finish: Joi.date().allow('', null),
            start: Joi.date().allow('', null),
            release: Joi.date().allow('', null),
        }
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
