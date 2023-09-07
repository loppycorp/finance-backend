const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        confirmation: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        order: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        operation: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        sub_operation: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        work_center: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        material: Joi.string().trim().hex().max(24).allow('', null),
        sequence: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        plant: Joi.string().trim().hex().max(24).allow('', null),
        confirm_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        clear_open_reservations: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
    },
    window: {
        date: {
            personnel_no: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            work_center: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            plant: Joi.string().trim().hex().max(24).allow('', null),
            posting_date: Joi.date().allow('', null),
            time_id: Joi.number().allow('', null),
        },
        quantity: {
            yield: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            unit: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            scrap: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            rework: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        }
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
