const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        material: Joi.string().trim().hex().max(24).allow('', null),
        plant: Joi.string().trim().hex().max(24).allow('', null),
    },
    window: {
        costing_data: {
            costing_variant: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            costing_version: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            costing_lot_size: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            transfer_control: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
        costs: {
            costs_based_on: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            component_view: Joi.array().items(Joi.object({
                cost_component_view: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
                total_costs: Joi.number().allow('', null),
                fixed_costs: Joi.number().allow('', null),
                variable: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
                currency: Joi.string().trim().hex().max(24).allow('', null),
            })),
            items: Joi.array().items(Joi.object({
                i: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
                resource: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
                cost_element: Joi.string().trim().hex().max(24).allow('', null),
                total_value: Joi.number().allow('', null),
                fixed_value: Joi.number().allow('', null),
                currency: Joi.string().trim().hex().max(24).allow('', null),
            })),
        }
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
